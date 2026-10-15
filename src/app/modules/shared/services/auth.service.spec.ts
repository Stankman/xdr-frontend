import { of, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { AccountService } from './account.service';
import { ClientService } from '../../client/services/client.service';
import { Api } from '../../core/models/api/api.model';
import { AuthTokens } from '../../core/models/auth/auth-tokens.model';

describe('Login contract', () => {
  it('sends email to the current login route and stores both returned tokens', () => {
    const tokens: AuthTokens = {
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      token_type: 'Bearer'
    };
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['post']);
    const account = jasmine.createSpyObj<AccountService>('AccountService', ['setTokens']);
    const client = new ClientService(api);
    api.post.and.returnValue(of(Object.assign(new Api<AuthTokens>(), { data: tokens })));
    const auth = new AuthService(api, account, client);
    let value: string;

    auth.signIn('player@example.com', 'password').subscribe(token => value = token);

    expect(api.post).toHaveBeenCalledWith('auth/login', {
      email: 'player@example.com',
      password: 'password'
    });
    expect(account.setTokens).toHaveBeenCalledWith(tokens);
    expect(value).toBe(tokens.access_token);
  });
});

describe('Logout cleanup', () => {
  it('clears local state even when server logout fails', () => {
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['post']);
    const account = jasmine.createSpyObj<AccountService>('AccountService', ['clearSession']);
    const client = new ClientService(api);
    client.clientOpened = true;
    client.sso = 'old-ticket';
    const response = new Subject<Api>();
    api.post.and.returnValue(response);
    const auth = new AuthService(api, account, client);
    let error: unknown;
    auth.signOut().subscribe({ error: value => error = value });
    response.error(new Error('Unavailable'));
    expect(error instanceof Error).toBeTrue();
    expect(account.clearSession).toHaveBeenCalledTimes(1);
    expect(client.clientOpened).toBeFalse();
    expect(client.sso).toBeNull();
  });
});

describe('Email verification contract', () => {
  function setup() {
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['post']);
    const account = jasmine.createSpyObj<AccountService>('AccountService', ['setTokens']);
    api.post.and.returnValue(of(Object.assign(new Api(), { data: { message: 'ok' } })));
    return { api, account, auth: new AuthService(api, account, new ClientService(api)) };
  }

  it('registers without starting a session', () => {
    const { api, account, auth } = setup();
    let completed = false;
    auth.signUp('player@example.com', 'password').subscribe({ complete: () => completed = true });
    expect(api.post).toHaveBeenCalledOnceWith('auth/register', { email: 'player@example.com', password: 'password' });
    expect(account.setTokens).not.toHaveBeenCalled();
    expect(completed).toBeTrue();
  });

  it('confirms tokens and resends verification links', () => {
    const { api, auth } = setup();
    auth.confirmEmail('token').subscribe();
    auth.resendVerification('player@example.com').subscribe();
    expect(api.post).toHaveBeenCalledWith('auth/email-verification/confirm', { token: 'token' });
    expect(api.post).toHaveBeenCalledWith('auth/email-verification/resend', { email: 'player@example.com' });
  });
});
