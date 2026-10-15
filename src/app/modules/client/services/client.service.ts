import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { BehaviorSubject, Observable, map } from 'rxjs';

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
        return this.apiService.get<string>('account/ticket')
        .pipe(
            map((response) => {
                if (typeof response.data !== 'string' || !response.data.trim()) {
                    throw new Error('The client ticket response is invalid.');
                }
                this.sso = response.data;
                return this.sso;
            })
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