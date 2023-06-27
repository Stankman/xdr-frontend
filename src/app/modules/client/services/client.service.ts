import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Api } from '../../core/models/api/api.model';

@Injectable({
    providedIn: 'root'
})
export class ClientService {
    private clientOpenedSubject: BehaviorSubject<boolean>;

    private SSOSubject: BehaviorSubject<string>;

    constructor(
        private readonly apiService : ApiService
    ) {
        this.clientOpenedSubject = new BehaviorSubject<boolean>(false);
        this.SSOSubject = new BehaviorSubject<string>('');
    }

    /**
     * Get the SSO Ticket
     * @return Observable<string>
     */
    public ticket() : Observable<string> {
        return this.apiService.get('account/ticket')
        .pipe(
            map((response : Api) => response.data.ticket)
        );
    }

    public get clientOpened(): boolean {
        return this.clientOpenedSubject.value;
    }

    public get clientOpenedObservable() : Observable<boolean> {
        return this.clientOpenedSubject.asObservable();
    }

    public set clientOpened(value : boolean) {
        this.clientOpenedSubject.next(value);
    }

    public get sso(): string {
        return this.SSOSubject.getValue();
    }
    
    public set sso(value: string) {
        this.SSOSubject.next(value);
    }
}