import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';

@Component({
  selector: 'xdr-acp-players',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table heading="Players" demoPath="players" [searchable]="true"
    [columns]="['ACP.ID', 'ACP.AVATAR_NAME', 'ACP.RANK', 'ACP.CREATED_AT']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayersComponent {}

@Component({
  selector: 'xdr-acp-player',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record demoPath="players"
    [fields]="['ACP.ID', 'ACP.AVATAR_NAME', 'ACP.ACCOUNT', 'ACP.RANK', 'ACP.CREATED_AT', 'ACP.ROOM_COUNT', 'ACP.BADGE_COUNT']"
    [collections]="['Currencies', 'ACP.CHATLOGS']" [actions]="['ACP.EDIT']" [banPlayer]="true" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerComponent {}
