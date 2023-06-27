import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { UrlService } from './modules/shared/services/url.service';
import { filter } from 'rxjs';
import { AccountService } from './modules/shared/services/account.service';
import { Account } from './modules/core/models/account/account.model';
import { ClientService } from './modules/client/services/client.service';

@Component({
  selector: 'xdr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public isLogged : boolean = false;

  constructor(
    private readonly primeNgConfig: PrimeNGConfig,
    private readonly urlService: UrlService,
    private readonly accountService: AccountService,
    private readonly clientService : ClientService,
    private readonly router : Router
  ) { }
  
  ngOnInit(): void {
    this.primeNgConfig.ripple = true;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event : NavigationEnd) => {
      if(event.urlAfterRedirects.startsWith('/client')) {
        this.urlService.previousURL = '/me'
      } else {
        this.urlService.previousURL = event.urlAfterRedirects;
      }
    });

    this.accountService.accountObservable.subscribe({
      next: (account : Account) => {
        if(account) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }
      }
    });
  }

  public isClient() : boolean {
    return this.router.url.startsWith('/client');
  }
}
