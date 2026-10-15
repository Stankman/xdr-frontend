import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AccountService } from '../modules/shared/services/account.service';
import { Avatar } from '../modules/core/models/avatar/avatar.model';
import { AuthenticatedGuard } from './authenticated.guard';
import { UnauthenticatedGuard } from './unauthenticated.guard';

describe('Session guards for website-only accounts', () => {
  const websiteAccount = { id: 1, email: 'player@example.com' };

  it('keeps avatar-only routes gated and explains that no avatar is linked', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    const accounts = jasmine.createSpyObj<AccountService>(
      'AccountService', [], { token: 'access-token', account: websiteAccount }
    );
    const messages = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake(key => key);
    const guard = new UnauthenticatedGuard(router, accounts, messages, translate);

    expect(guard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/articles');
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'warn',
      summary: 'ERROR.AVATAR_REQUIRED'
    }));
  });

  it('allows avatar-only routes when the account has an active avatar', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    const accounts = jasmine.createSpyObj<AccountService>(
      'AccountService', [], {
        token: 'access-token',
        account: { ...websiteAccount, activeAvatar: Object.assign(new Avatar(), { username: 'player' }) }
      }
    );
    const messages = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    const guard = new UnauthenticatedGuard(router, accounts, messages, translate);

    expect(guard.canActivate()).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(messages.add).not.toHaveBeenCalled();
  });

  it('redirects anonymous users away from avatar-only routes', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    const accounts = jasmine.createSpyObj<AccountService>(
      'AccountService', [], { token: null, account: null }
    );
    const messages = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake(key => key);
    const guard = new UnauthenticatedGuard(router, accounts, messages, translate);

    expect(guard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({
      severity: 'error',
      summary: 'ERROR.UNAUTHENTICATED.SUMMARY',
      detail: 'ERROR.UNAUTHENTICATED.DETAIL'
    }));
  });

  it('returns an authenticated website account to public news instead of the avatar home', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    const accounts = jasmine.createSpyObj<AccountService>(
      'AccountService', [], { token: 'access-token', account: websiteAccount }
    );
    const guard = new AuthenticatedGuard(router, accounts);

    expect(guard.canActivate()).toBeFalse();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/articles');
  });

  it('allows public entry routes when no session exists', () => {
    const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    const accounts = jasmine.createSpyObj<AccountService>(
      'AccountService', [], { token: null, account: null }
    );
    const guard = new AuthenticatedGuard(router, accounts);

    expect(guard.canActivate()).toBeTrue();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
