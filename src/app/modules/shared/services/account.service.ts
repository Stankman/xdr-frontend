import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, shareReplay } from 'rxjs';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from './api.service';
import { Account } from '../../core/models/account/account.model';
import { AuthTokens } from '../../core/models/auth/auth-tokens.model';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private readonly accountSubject = new BehaviorSubject<Account | null>(null);
    private restoration: Observable<Account | null>;
    private sessionWarning = false;

    constructor(
        private readonly apiService: ApiService,
        private readonly messages: MessageService,
        private readonly translate: TranslateService
    ) {
        const stored = localStorage.getItem('xdr-account');
        if (stored) {
            try {
                const account: unknown = JSON.parse(stored);
                if (this.isAccount(account)) {
                    this.accountSubject.next(account);
                } else {
                    this.clearSession();
                    this.notifyInvalidSession();
                }
            } catch (error) {
                if (!(error instanceof SyntaxError)) {
                    throw error;
                }
                this.clearSession();
                this.notifyInvalidSession();
            }
        }
    }

    public restoreSession(): Observable<Account | null> {
        if (!this.restoration) {
            const token = this.token;
            if (!token || (this.isExpired(token) && !this.refreshToken)) {
                const hadSession = !!token || !!this.account;
                this.clearSession();
                if (hadSession) this.notifyInvalidSession();
                this.restoration = of(null);
            } else {
                this.restoration = this.getAccountByJWT(token).pipe(
                    catchError(() => {
                        this.clearSession();
                        this.notifyInvalidSession();
                        return of(null);
                    }),
                    shareReplay({ bufferSize: 1, refCount: false })
                );
            }
        }
        return this.restoration;
    }

    public getAccountByJWT(token: string): Observable<Account> {
        return this.apiService.get<Account>('auth/me', { headers: { Authorization: `Bearer ${token}` } }).pipe(
            map((response) => {
                if (!this.isAccount(response.data)) {
                    throw new Error('The account response is not a valid website account.');
                }
                if (!this.token || this.token === token) this.token = token;
                this.account = response.data;
                return response.data;
            })
        );
    }

    public setTokens(tokens: AuthTokens): void {
        this.token = tokens.access_token;
        this.refreshToken = tokens.refresh_token;
        this.restoration = undefined;
    }

    private isAccount(value: unknown): value is Account {
        if (typeof value !== 'object' || value === null ||
            !('id' in value) || typeof value.id !== 'number' ||
            !('email' in value) || typeof value.email !== 'string') {
            return false;
        }
        if (!('activeAvatar' in value) || value.activeAvatar === null) return true;
        return typeof value.activeAvatar === 'object' &&
            'username' in value.activeAvatar && typeof value.activeAvatar.username === 'string';
    }

    private isExpired(token: string): boolean {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        try {
            const payload: unknown = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
            return typeof payload !== 'object' || payload === null ||
                !('exp' in payload) || typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now();
        } catch (error) {
            if (!(error instanceof SyntaxError) && !(error instanceof DOMException)) throw error;
            return true;
        }
    }

    private notifyInvalidSession(): void {
        // Startup restoration runs before the toast view subscribes.
        this.sessionWarning = true;
    }

    public reportSessionWarning(): void {
        if (!this.sessionWarning) return;
        this.sessionWarning = false;
        this.messages.add({ severity: 'warn', summary: this.translate.instant('ERROR.SESSION') });
    }

    public clearSession(): void {
        localStorage.removeItem('xdr-token');
        localStorage.removeItem('xdr-refresh-token');
        localStorage.removeItem('xdr-account');
        this.accountSubject.next(null);
        this.restoration = undefined;
    }

    public get account(): Account | null { return this.accountSubject.value; }
    public get accountObservable(): Observable<Account | null> { return this.accountSubject.asObservable(); }
    public set account(value: Account | null) {
        if (value) localStorage.setItem('xdr-account', JSON.stringify(value));
        else localStorage.removeItem('xdr-account');
        this.accountSubject.next(value);
    }
    public get token(): string | null { return localStorage.getItem('xdr-token'); }
    public set token(value: string | null) {
        if (value) localStorage.setItem('xdr-token', value);
        else localStorage.removeItem('xdr-token');
    }
    public get refreshToken(): string | null { return localStorage.getItem('xdr-refresh-token'); }
    public set refreshToken(value: string | null) {
        if (value) localStorage.setItem('xdr-refresh-token', value);
        else localStorage.removeItem('xdr-refresh-token');
    }
}
