import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './account.service';
import { ApiService } from './api.service';
import { Api } from '../../core/models/api/api.model';

describe('AccountService persistence', () => {
  let api: jasmine.SpyObj<ApiService>;
  let messages: jasmine.SpyObj<MessageService>;
  beforeEach(() => {
    localStorage.removeItem('xdr-account');
    localStorage.removeItem('xdr-token');
    localStorage.removeItem('xdr-refresh-token');
    api = jasmine.createSpyObj('ApiService', ['get']);
    messages = jasmine.createSpyObj('MessageService', ['add']);
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake(key => key);
    TestBed.configureTestingModule({ providers: [
      AccountService, { provide: ApiService, useValue: api },
      { provide: MessageService, useValue: messages }, { provide: TranslateService, useValue: translate }
    ] });
  });
  afterEach(() => {
    localStorage.removeItem('xdr-account');
    localStorage.removeItem('xdr-token');
    localStorage.removeItem('xdr-refresh-token');
  });

  it('clears malformed JSON and reports it without crashing startup', () => {
    localStorage.setItem('xdr-account', '{broken');
    localStorage.setItem('xdr-token', 'stale');
    const service = TestBed.inject(AccountService);
    expect(service.account).toBeNull();
    expect(localStorage.getItem('xdr-token')).toBeNull();
    expect(messages.add).not.toHaveBeenCalled();
    service.reportSessionWarning();
    service.reportSessionWarning();
    expect(messages.add).toHaveBeenCalledTimes(1);
  });

  it('clears expired JWTs before making a request', () => {
    localStorage.setItem('xdr-token', `header.${btoa(JSON.stringify({ exp: 1 }))}.signature`);
    const service = TestBed.inject(AccountService);
    service.restoreSession().subscribe();
    service.reportSessionWarning();
    expect(api.get).not.toHaveBeenCalled();
    expect(localStorage.getItem('xdr-token')).toBeNull();
    expect(messages.add).toHaveBeenCalled();
  });

  it('reconciles a token with the API once and persists the account', () => {
    const account = { id: 1, email: 'fixture@example.com', activeAvatar: { username: 'Fixture' } };
    localStorage.setItem('xdr-token', 'opaque-token');
    api.get.and.returnValue(of(Object.assign(new Api(), { data: account })));
    const service = TestBed.inject(AccountService);
    service.restoreSession().subscribe();
    service.restoreSession().subscribe();
    expect(api.get).toHaveBeenCalledOnceWith('auth/me', {
      headers: { Authorization: 'Bearer opaque-token' }
    });
    expect(api.get).toHaveBeenCalledTimes(1);
    expect(service.account?.activeAvatar.username).toBe('Fixture');
    expect(JSON.parse(localStorage.getItem('xdr-account')).id).toBe(1);
  });

  it('keeps an expired access token when a refresh token is available', () => {
    localStorage.setItem('xdr-token', `header.${btoa(JSON.stringify({ exp: 1 }))}.signature`);
    localStorage.setItem('xdr-refresh-token', 'refresh-token');
    api.get.and.returnValue(of(Object.assign(new Api(), {
      data: { id: 1, email: 'fixture@example.com', activeAvatar: { username: 'Fixture' } }
    })));
    const service = TestBed.inject(AccountService);

    service.restoreSession().subscribe();

    expect(api.get).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('xdr-refresh-token')).toBe('refresh-token');
  });

  it('stores and clears both authentication tokens', () => {
    const service = TestBed.inject(AccountService);
    service.setTokens({
      access_token: 'access-token',
      refresh_token: 'refresh-token',
      token_type: 'Bearer'
    });

    expect(service.token).toBe('access-token');
    expect(service.refreshToken).toBe('refresh-token');

    service.clearSession();

    expect(service.token).toBeNull();
    expect(service.refreshToken).toBeNull();
  });

  it('accepts the website account summary without a linked avatar', () => {
    api.get.and.returnValue(of(Object.assign(new Api(), {
      data: { id: 1, email: 'player@example.com', emailVerified: true, createdAt: '2026-01-01T00:00:00Z' }
    })));
    const service = TestBed.inject(AccountService);

    service.getAccountByJWT('token').subscribe();

    expect(service.account).toEqual(jasmine.objectContaining({ id: 1, email: 'player@example.com' }));
    expect(service.account.activeAvatar).toBeUndefined();
  });

  it('rejects account responses without a valid website account identity', () => {
    api.get.and.returnValue(of(Object.assign(new Api(), { data: { id: 1 } })));
    const service = TestBed.inject(AccountService);
    let error: unknown;
    service.getAccountByJWT('token').subscribe({ error: value => error = value });
    expect(error instanceof Error).toBeTrue();
    expect(service.account).toBeNull();
  });

  it('clears a rejected restored session and reports it when the UI is ready', () => {
    localStorage.setItem('xdr-token', 'opaque-token');
    api.get.and.returnValue(throwError(() => new Error('Account unavailable')));
    const service = TestBed.inject(AccountService);
    let account: unknown = 'not emitted';
    service.restoreSession().subscribe(value => account = value);
    expect(account).toBeNull();
    expect(localStorage.getItem('xdr-token')).toBeNull();
    service.reportSessionWarning();
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'warn' }));
  });
});
