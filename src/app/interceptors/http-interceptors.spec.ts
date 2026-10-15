import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { JwtInterceptor } from './jwt.interceptor';
import { ServerErrorInterceptor } from './server-error.interceptor';
import { AccountService } from '../modules/shared/services/account.service';
import { ErrorService } from '../modules/core/services/error.service';
import { environment } from 'src/environments/environment';

describe('API interceptors', () => {
  let http: HttpClient;
  let requests: HttpTestingController;
  let errors: jasmine.SpyObj<ErrorService>;
  let accounts: jasmine.SpyObj<AccountService>;
  const url = `${environment.app.endpoint}/account`;

  beforeEach(() => {
    errors = jasmine.createSpyObj('ErrorService', ['handleError']);
    accounts = jasmine.createSpyObj<AccountService>(
      'AccountService', ['clearSession', 'setTokens'],
      { token: 'fixture-token', refreshToken: null }
    );
    TestBed.configureTestingModule({ providers: [
      provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(),
      { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptor, multi: true },
      { provide: AccountService, useValue: accounts }, { provide: ErrorService, useValue: errors }
    ] });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
  });
  afterEach(() => requests.verify());

  it('adds credentials only to the configured API and preserves explicit headers', () => {
    http.get(url).subscribe();
    const api = requests.expectOne(url);
    expect(api.request.headers.get('Authorization')).toBe('Bearer fixture-token');
    api.flush({});
    http.get('/assets/lang/en.json').subscribe();
    const asset = requests.expectOne('/assets/lang/en.json');
    expect(asset.request.headers.has('Authorization')).toBeFalse();
    asset.flush({});
    http.get(url, { headers: { Authorization: 'Bearer explicit' } }).subscribe();
    const explicit = requests.expectOne(url);
    expect(explicit.request.headers.get('Authorization')).toBe('Bearer explicit');
    explicit.flush({});
  });

  it('propagates structured errors and clears expired sessions', () => {
    let received: HttpErrorResponse;
    http.get(url).subscribe({ error: error => received = error });
    requests.expectOne(url).flush({ status: 'error', code: 401 });
    expect(received instanceof HttpErrorResponse).toBeTrue();
    expect(received.error.code).toBe(401);
    expect(errors.handleError).toHaveBeenCalledWith(401);
    expect(accounts.clearSession).toHaveBeenCalled();
  });

  it('preserves HTTP status and permits null successful bodies', () => {
    let received: HttpErrorResponse;
    http.get(url).subscribe({ error: error => received = error });
    requests.expectOne(url).flush(null, { status: 503, statusText: 'Unavailable' });
    expect(received.status).toBe(503);
    expect(errors.handleError).toHaveBeenCalledWith(503);
    let value: unknown = 'pending';
    http.get(url).subscribe(body => value = body);
    requests.expectOne(url).flush(null);
    expect(value).toBeNull();
  });

  it('refreshes once and retries concurrent requests with the rotated access token', () => {
    Object.defineProperty(accounts, 'refreshToken', { configurable: true, value: 'refresh-token' });
    const results: unknown[] = [];
    http.get(url).subscribe(value => results.push(value));
    http.get(url).subscribe(value => results.push(value));

    const failedRequests = requests.match(url);
    expect(failedRequests.length).toBe(2);
    failedRequests.forEach(request => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer fixture-token');
      request.flush({ status: 401, message: 'Expired' }, { status: 401, statusText: 'Unauthorized' });
    });

    const refresh = requests.expectOne(`${environment.app.endpoint}/auth/refresh`);
    expect(refresh.request.method).toBe('POST');
    expect(refresh.request.body).toEqual({ refreshToken: 'refresh-token' });
    refresh.flush({
      status: 'ok',
      code: 200,
      data: { access_token: 'rotated-access', refresh_token: 'rotated-refresh', token_type: 'Bearer' }
    });

    const retriedRequests = requests.match(url);
    expect(retriedRequests.length).toBe(2);
    retriedRequests.forEach(request => {
      expect(request.request.headers.get('Authorization')).toBe('Bearer rotated-access');
      request.flush({ status: 'ok', code: 200, data: 'ok' });
    });

    expect(accounts.setTokens).toHaveBeenCalledWith({
      access_token: 'rotated-access',
      refresh_token: 'rotated-refresh',
      token_type: 'Bearer'
    });
    expect(results.length).toBe(2);
    expect(errors.handleError).not.toHaveBeenCalled();
  });

  it('clears the session when the refresh token is rejected', () => {
    Object.defineProperty(accounts, 'refreshToken', { configurable: true, value: 'refresh-token' });
    let received: unknown;
    http.get(url).subscribe({ error: error => received = error });
    requests.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    requests.expectOne(`${environment.app.endpoint}/auth/refresh`)
      .flush({ status: 401, message: 'Invalid refresh token' }, { status: 401, statusText: 'Unauthorized' });

    expect(received instanceof HttpErrorResponse).toBeTrue();
    expect(accounts.clearSession).toHaveBeenCalled();
    expect(errors.handleError).toHaveBeenCalledWith(401);
  });

  it('still handles structured API errors returned by a retried request', () => {
    Object.defineProperty(accounts, 'refreshToken', { configurable: true, value: 'refresh-token' });
    let received: unknown;
    http.get(url).subscribe({ error: error => received = error });
    requests.expectOne(url).flush({}, { status: 401, statusText: 'Unauthorized' });
    requests.expectOne(`${environment.app.endpoint}/auth/refresh`).flush({
      status: 'ok',
      code: 200,
      data: { access_token: 'rotated-access', refresh_token: 'rotated-refresh', token_type: 'Bearer' }
    });
    requests.expectOne(url).flush({ status: 'error', code: 401 });

    expect(received instanceof HttpErrorResponse).toBeTrue();
    expect(accounts.clearSession).toHaveBeenCalled();
    expect(errors.handleError).toHaveBeenCalledWith(401);
  });
});
