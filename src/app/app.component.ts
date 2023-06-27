import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { UrlService } from './modules/shared/services/url.service';
import { filter } from 'rxjs';

@Component({
  selector: 'xdr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private readonly primeNgConfig : PrimeNGConfig,
    private readonly urlService : UrlService,
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
  }

  public isClient() : boolean {
    return this.router.url.startsWith('/client');
  }
}
