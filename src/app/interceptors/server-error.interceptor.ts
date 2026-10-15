import {
    HttpBackend,
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, finalize, map, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthTokens } from '../modules/core/models/auth/auth-tokens.model';
import { Api } from '../modules/core/models/api/api.model';
import { ErrorService } from '../modules/core/services/error.service';
import { AccountService } from '../modules/shared/services/account.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
    private readonly rawHttp: HttpClient;
    private tokenRefresh?: Observable<AuthTokens>;
    private readonly apiEndpoint = environment.app.endpoint.replace(/\/+$/, '');

    constructor(
        backend: HttpBackend,
        private readonly errors: ErrorService,
        private readonly accounts: AccountService
    ) {
        this.rawHttp = new HttpClient(backend);
    }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        const api = request.url.startsWith(`${this.apiEndpoint}/`);
        return next.handle(request).pipe(
            map(event => this.checkResponse(event, api)),
            catchError((error: unknown) => this.handleError(request, next, api, error))
        );
    }

    private handleError(
        request: HttpRequest<unknown>,
        next: HttpHandler,
        api: boolean,
        error: unknown
    ): Observable<HttpEvent<unknown>> {
        if (!api) return throwError(() => error);

        const code = this.errorCode(error);
        if (code === 401 && this.canRefresh(request)) {
            return this.refreshTokens().pipe(
                switchMap(tokens => next.handle(request.clone({
                    setHeaders: { Authorization: `Bearer ${tokens.access_token}` }
                })).pipe(map(event => this.checkResponse(event, true)))),
                catchError((retryError: unknown) => {
                    const retryCode = this.errorCode(retryError);
                    if (retryCode === 401) this.accounts.clearSession();
                    this.errors.handleError(retryCode);
                    return throwError(() => retryError);
                })
            );
        }

        if (code === 401) this.accounts.clearSession();
        this.errors.handleError(code);
        return throwError(() => error);
    }

    private canRefresh(request: HttpRequest<unknown>): boolean {
        if (!this.accounts.refreshToken || !request.headers.has('Authorization')) return false;

        const path = request.url.slice(this.apiEndpoint.length).replace(/^\/+/, '').split('?')[0];
        return ![
            'auth/login',
            'auth/register',
            'auth/refresh',
            'auth/logout'
        ].includes(path);
    }

    private refreshTokens(): Observable<AuthTokens> {
        if (!this.tokenRefresh) {
            const refreshToken = this.accounts.refreshToken;
            if (!refreshToken) {
                return throwError(() => new Error('No refresh token is available.'));
            }

            this.tokenRefresh = this.rawHttp.post<Api<AuthTokens>>(
                `${this.apiEndpoint}/auth/refresh`,
                { refreshToken }
            ).pipe(
                map(response => {
                    const tokens = response.data;
                    if (!tokens?.access_token || !tokens.refresh_token || tokens.token_type !== 'Bearer') {
                        this.accounts.clearSession();
                        throw new Error('The refresh response does not contain a valid token pair.');
                    }
                    this.accounts.setTokens(tokens);
                    return tokens;
                }),
                finalize(() => this.tokenRefresh = undefined),
                shareReplay({ bufferSize: 1, refCount: false })
            );
        }
        return this.tokenRefresh;
    }

    private errorCode(error: unknown): number | undefined {
        if (error instanceof HttpErrorResponse) {
            return this.isError(error.error) && typeof error.error.code === 'number'
                ? error.error.code
                : error.status;
        }
        return undefined;
    }

    private isError(body: unknown): body is { status: 'error'; code?: number } {
        return typeof body === 'object' && body !== null && 'status' in body && body.status === 'error';
    }

    private checkResponse(event: HttpEvent<unknown>, api: boolean): HttpEvent<unknown> {
        if (api && event instanceof HttpResponse && this.isError(event.body)) {
            throw new HttpErrorResponse({
                error: event.body, headers: event.headers, url: event.url,
                status: 400, statusText: 'API error'
            });
        }
        return event;
    }
}
