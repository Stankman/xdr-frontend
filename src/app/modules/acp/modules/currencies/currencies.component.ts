import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';
import { AcpPendingFormComponent } from '../../ui/acp-pending-form.component';

@Component({
  selector: 'xdr-acp-currencies',
  imports: [RouterModule, TranslateModule, AcpTableComponent],
  template: `
    <div class="acp-list-actions"><a class="acp-action-link" routerLink="new">{{ 'ACP.ADD_CURRENCY' | translate }}</a></div>
    <xdr-acp-table heading="Currencies" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrenciesComponent {}

@Component({
  selector: 'xdr-acp-currency',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyComponent {}

@Component({
  selector: 'xdr-acp-add-currency',
  imports: [AcpPendingFormComponent],
  template: `<xdr-acp-pending-form heading="ACP.ADD_CURRENCY" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCurrencyComponent {}
