import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

export interface AcpNavigationItem {
  path: string;
  label: string;
  icon: string;
  group: string;
}

@Component({
  selector: 'xdr-acp-sidebar',
  templateUrl: './sidebar.component.html',
  imports: [RouterModule, TooltipModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpSidebarComponent {
  @Input({ required: true }) items: readonly AcpNavigationItem[] = [];
  readonly groups = ['GENERAL', 'HOTEL', 'ADMIN'];
}
