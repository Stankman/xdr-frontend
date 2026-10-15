import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';
import { AcpPendingFormComponent } from '../../ui/acp-pending-form.component';

@Component({
  selector: 'xdr-acp-bans',
  imports: [RouterModule, TranslateModule, AcpTableComponent],
  template: `
    <div class="acp-list-actions"><a class="acp-action-link" routerLink="new">{{ 'ACP.CREATE_BAN' | translate }}</a></div>
    <xdr-acp-table heading="Bans" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BansComponent {}

@Component({
  selector: 'xdr-acp-ban',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record [actions]="['ACP.EDIT', 'ACP.REVOKE']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BanComponent {}

@Component({
  selector: 'xdr-acp-create-ban',
  imports: [AcpPendingFormComponent],
  template: `<xdr-acp-pending-form heading="ACP.CREATE_BAN" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBanComponent {}
