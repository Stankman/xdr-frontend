import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'xdr-acp-topbar',
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpTopbarComponent {
  @Input({ required: true }) title = '';
}
