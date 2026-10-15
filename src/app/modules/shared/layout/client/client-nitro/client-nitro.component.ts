import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EMPTY, catchError, distinctUntilChanged, exhaustMap, filter, finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ClientService } from 'src/app/modules/client/services/client.service';
import { client } from 'src/environments/environment';

@Component({
  selector: 'xdr-client-nitro',
  templateUrl: './client-nitro.component.html',
  styleUrls: ['./client-nitro.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ClientNitroComponent implements OnInit {
  public source: SafeResourceUrl | null = null;
  public loading = false;
  public failed = false;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly clientService: ClientService,
    private readonly sanitizer: DomSanitizer,
    public readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.clientService.clientOpenedObservable.pipe(
      distinctUntilChanged(),
      filter(opened => opened && !this.source),
      exhaustMap(() => {
        this.loading = true;
        this.failed = false;
        return this.clientService.ticket().pipe(
          catchError(() => {
            this.failed = true;
            return EMPTY;
          }),
          finalize(() => this.loading = false)
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(ticket => {
      const url = new URL(client.nitro.source);
      url.searchParams.set('sso', ticket);
      this.source = this.sanitizer.bypassSecurityTrustResourceUrl(url.toString());
    });
  }

  public retry(): void {
    this.clientService.clientOpened = false;
    this.clientService.clientOpened = true;
  }
}
