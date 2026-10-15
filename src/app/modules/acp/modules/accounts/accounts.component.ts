import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';

@Component({
  selector: 'xdr-acp-accounts',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table heading="Accounts" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountsComponent {}

@Component({
  selector: 'xdr-acp-account',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record [fields]="['ACP.RANK_GROUP']"
    [collections]="['ACP.AVATARS', 'ACP.SESSIONS']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {}
