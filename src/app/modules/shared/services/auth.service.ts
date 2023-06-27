import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { Api } from "../../core/models/api/api.model";
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
     * @param identification
     * @param password
     * @return Observable<string>
    */
    public signIn(identification : string, password : string) : Observable<string> {
        return this.apiService
            .post('auth/signin',{ identification, password })
            .pipe(
                map((response : Api) => (this.accountService.token = response.data.access_token))
            );
    }

    /**
     * Creates and authenticates a user
     *
     * @param email
     * @param password
     * @return Observable<string>
    */
    public signUp(email : string, password : string) : Observable<string> {
        return this.apiService
            .post('auth/signup',{ email, password })
            .pipe(
                map((response : Api) => (this.accountService.token = response.data.access_token))
            );
    }

    /**
     * Signs out user
     * 
     * @return Observable<any> 
    */
    public signOut() : Observable<any> {
        return this.apiService.post('auth/signout', {}).pipe(
            map(() => {
                localStorage.removeItem('xdr-account');
                localStorage.removeItem('xdr-token');
                this.accountService.account = null;
                this.clientService.clientOpened = false;
                this.clientService.sso = null;
                return;
            })
        );
    }
}