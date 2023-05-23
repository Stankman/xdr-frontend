import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { ApiService } from "./api.service";
import { Account } from "../../core/models/account/account.model";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    
    private readonly accountSubject : BehaviorSubject<Account>;

    constructor(
        private readonly apiService : ApiService
    ) {
        this.accountSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('xdr-account')));
    }
    
    /**
     * Retrieve Account by JWT
     * 
     * @param token
     * @return Obsevable<Account>
    */
    public getAccountByJWT(token : string) : Observable<Account> {
        return this.apiService.get('account', { headers: { Authorization: `Bearer ${token}` } }).pipe(
            map((res) => {
                if(!this.token) {
                    this.token = token;
                }
                this.account = res.data;
                this.setXDRAccount();
                return this.account;
            })
        );
    }

    /**
     * Sets Localstorage Xdr Account
     * 
     * @return
    */
    private setXDRAccount() : void {
        let xdrAccount : Account = this.account;

        delete xdrAccount.roles;

        localStorage.setItem('xdr-account', JSON.stringify(xdrAccount));
    }

    /**
     * Returns the current logged account
     *
     * @return Account
    */
    public get account() : Account {
        return this.accountSubject.value;
    }

    /**
     * 
    */
    public get accountObservable() : Observable<Account> {
        return this.accountSubject.asObservable();
    }

    /**
     * Update current logged account
    */
    public set account(value : Account) {
        this.accountSubject.next(value);
    }

    /**
     * Returns the current logged JWT
     *
     * @return string
    */
    public get token(): string {
        return localStorage.getItem('xdr-token')
    }

    /**
     * Update current logged JWT
    */    
    public set token(value: string) {
        localStorage.setItem('xdr-token', value);    
    }
}