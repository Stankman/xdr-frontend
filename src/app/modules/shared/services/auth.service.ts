import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, finalize, map } from "rxjs";
import { AuthTokens } from "../../core/models/auth/auth-tokens.model";
import { AccountService } from "./account.service";
import { ClientService } from "../../client/services/client.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    constructor(
        private apiService : ApiService,
        private accountService : AccountService,
        private clientService : ClientService
    ) {}

    /**
     * Authenticates a user provided by his
     * username and password
     *
     * @param email
     * @param password
     * @return Observable<string>
    */
    public signIn(email : string, password : string) : Observable<string> {
        return this.apiService
            .post<AuthTokens>('auth/login',{ email, password })
            .pipe(
                map((response) => {
                    if (!response.data?.access_token || !response.data.refresh_token ||
                        response.data.token_type !== 'Bearer') {
                        throw new Error('The login response does not contain a valid token pair.');
                    }
                    this.accountService.setTokens(response.data);
                    return response.data.access_token;
                })
            );
    }

    /**
     * Creates an unverified account. The API emails a verification link
     * and does not start a session, so the user must verify before signing in.
    */
    public signUp(email : string, password : string) : Observable<void> {
        return this.apiService
            .post<{ message: string }>('auth/register', { email, password })
            .pipe(map(() => undefined));
    }

    public resendVerification(email : string) : Observable<void> {
        return this.apiService
            .post<{ message: string }>('auth/email-verification/resend', { email })
            .pipe(map(() => undefined));
    }

    public confirmEmail(token : string) : Observable<void> {
        return this.apiService
            .post<{ message: string }>('auth/email-verification/confirm', { token })
            .pipe(map(() => undefined));
    }

    /**
     * Signs out user
     * 
     * @return Observable<any> 
    */
    public signOut() : Observable<void> {
        return this.apiService.post<void>('auth/logout', {}).pipe(
            map(() => undefined),
            finalize(() => {
                this.accountService.clearSession();
                this.clientService.clientOpened = false;
                this.clientService.sso = null;
            })
        );
    }
}