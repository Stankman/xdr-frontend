import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy, afterNextRender } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { UrlService } from './modules/shared/services/url.service';
import { filter } from 'rxjs';
import { AccountService } from './modules/shared/services/account.service';
import { Account } from './modules/core/models/account/account.model';
import { ClientService } from './modules/client/services/client.service';

@Component({
    selector: 'xdr-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements OnInit {
  public isLogged : boolean = false;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly urlService: UrlService,
    private readonly accountService: AccountService,
    private readonly clientService : ClientService,
    private readonly router : Router
  ) {
    afterNextRender(() => this.accountService.reportSessionWarning());
  }
  
  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((event : NavigationEnd) => {
      if(event.urlAfterRedirects.startsWith('/client')) {
        this.urlService.previousURL = '/me'
      } else {
        this.urlService.previousURL = event.urlAfterRedirects;
      }
    });

    this.accountService.accountObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (account : Account) => {
        if(account) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
          this.clientService.clientOpened = false;
          this.clientService.sso = null;
          if (this.isClient() || /^\/(me|shop|team)(\/|$)/.test(this.router.url)) this.router.navigateByUrl('/');
        }
      }
    });
  }

  public isClient() : boolean {
    return this.router.url.startsWith('/client');
  }
}
