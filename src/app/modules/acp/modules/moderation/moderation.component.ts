import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';

@Component({
  selector: 'xdr-acp-moderation',
  imports: [AcpTableComponent],
  template: `<xdr-acp-table heading="ACP.TICKETS" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModerationComponent {}

@Component({
  selector: 'xdr-acp-ticket',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TicketComponent {}
