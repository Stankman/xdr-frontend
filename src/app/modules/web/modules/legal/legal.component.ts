import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

type LegalPage = 'terms' | 'privacy' | 'cookies';

const sections: Record<LegalPage, readonly string[]> = {
  terms: ['OPERATOR', 'ACCOUNT', 'CONDUCT', 'PURCHASES', 'MODERATION', 'CHANGES'],
  privacy: ['CONTROLLER', 'DATA', 'PURPOSES', 'PROVIDERS', 'RETENTION', 'RIGHTS'],
  cookies: ['SCOPE', 'STORAGE', 'THIRD_PARTIES', 'CHOICES', 'CONTACT']
};

@Component({
  selector: 'xdr-legal',
  imports: [RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './legal.component.html',
  styleUrl: './legal.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager
})
export class LegalComponent {
  public readonly hotelName = environment.app.hotelName;
  public page: LegalPage = 'terms';
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      const page: unknown = data['legalPage'];
      if (page !== 'terms' && page !== 'privacy' && page !== 'cookies') {
        throw new Error('Legal route requires a valid legalPage.');
      }
      this.page = page;
    });
  }

  public get translationKey(): string { return `LEGAL.${this.page.toUpperCase()}`; }
  public get sections(): readonly string[] { return sections[this.page]; }
}
