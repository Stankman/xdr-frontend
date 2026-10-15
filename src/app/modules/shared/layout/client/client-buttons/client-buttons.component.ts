import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from '../../../services/url.service';

@Component({
    selector: 'xdr-client-buttons',
    templateUrl: './client-buttons.component.html',
    styleUrls: ['./client-buttons.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ClientButtonsComponent {
  constructor(
    private readonly router: Router,
    private readonly urlService: UrlService
  ) {}

  public goBack(): void {
    this.router.navigateByUrl(this.urlService.previousURL ?? '/me');
  }
}
