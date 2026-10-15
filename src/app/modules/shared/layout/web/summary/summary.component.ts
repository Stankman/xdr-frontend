import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { LookService } from '../../../services/look.service';
import { LookSizes } from 'src/app/modules/core/models/look/look-sizes.model';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'xdr-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SummaryComponent {
  public readonly hotelName = environment.app.hotelName;
  public readonly account$ = inject(AccountService).accountObservable;
  private readonly lookService = inject(LookService);

  public getLook(look: string): string {
    return this.lookService.get({ look, size: LookSizes.LARGE });
  }
}
