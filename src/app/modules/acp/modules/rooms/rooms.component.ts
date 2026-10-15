import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';

@Component({
  selector: 'xdr-acp-rooms',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table heading="Rooms" demoPath="rooms" [searchable]="true"
    [columns]="['ACP.ID', 'ACP.NAME', 'ACP.OWNER', 'ACP.PRIVACY']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsComponent {}

@Component({
  selector: 'xdr-acp-room',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record demoPath="rooms" [fields]="['ACP.ID', 'ACP.NAME', 'ACP.OWNER', 'ACP.PRIVACY', 'ACP.RATING']"
    [collections]="['ACP.RATERS', 'ACP.VISITOR_LOGS', 'ACP.CHATLOGS', 'ACP.ROOM_WORDFILTER',
      'ACP.RIGHTS', 'ACP.MUTED_USERS', 'ACP.ROOM_BANS', 'ACP.EVENT_HISTORY']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomComponent {}
