import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';

@Component({
  selector: 'xdr-acp-permission-groups',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table [heading]="heading" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionGroupsComponent {
  readonly heading: string = inject(ActivatedRoute).snapshot.data['pageLabel'];
}

@Component({
  selector: 'xdr-acp-permission-group',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record [fields]="['ACP.MEMBER_COUNT']"
    [collections]="['ACP.GROUP_PERMISSIONS', 'ACP.INHERITED_GROUPS', members]" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionGroupComponent {
  readonly members = inject(ActivatedRoute).snapshot.data['scope'] === 'hotel' ? 'Players' : 'Accounts';
}
