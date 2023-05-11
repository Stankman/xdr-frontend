import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { Api } from "../../core/models/api/api.model";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    
    constructor(
        private apiService : ApiService
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
                map((response : Api) => (this.token = response.data.access_token))
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
                map((response : Api) => (this.token = response.data.access_token))
            );
    }

    /**
     * Returns token from local storage
     *
     * @return string
    */
    public get token(): string {
        return localStorage.getItem('xdr-token');
    }

    /**
     * Set local storage token
     *
     * @param value
    */
    public set token(value: string) {
        localStorage.setItem('xdr-token', value);
    }

    public isAuthenticated() : boolean {
        return !!this.token;
    }
}