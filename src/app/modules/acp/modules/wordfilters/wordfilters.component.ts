import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AcpTableComponent } from '../../ui/acp-table.component';
import { AcpRecordComponent } from '../../ui/acp-record.component';
import { AcpPendingFormComponent } from '../../ui/acp-pending-form.component';

@Component({
  selector: 'xdr-acp-wordfilters',
  imports: [RouterModule, TranslateModule, AcpTableComponent],
  template: `
    <div class="acp-list-actions"><a class="acp-action-link" routerLink="new">{{ 'ACP.ADD_FILTER' | translate }}</a></div>
    <xdr-acp-table heading="WordFilter" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordfiltersComponent {}

@Component({
  selector: 'xdr-acp-wordfilter',
  imports: [AcpRecordComponent],
  template: `<xdr-acp-record [actions]="['ACP.EDIT', 'ACP.DELETE']" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WordfilterComponent {}

@Component({
  selector: 'xdr-acp-add-wordfilter',
  imports: [AcpPendingFormComponent],
  template: `<xdr-acp-pending-form heading="ACP.ADD_FILTER" />`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddWordfilterComponent {}
