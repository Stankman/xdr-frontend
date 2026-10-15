import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

export type AcpDataState = 'pending' | 'definition' | 'loading' | 'error' | 'empty' | 'noResults' | 'notFound' | 'ready';

@Component({
  selector: 'xdr-acp-state',
  imports: [TranslateModule],
  template: `
    @if (state !== 'ready') {
      <div class="acp-data-state" [attr.role]="state === 'error' ? 'alert' : 'status'"
           [attr.aria-busy]="state === 'loading'" [attr.data-state]="state">
        <i [class]="state === 'error' ? 'pi pi-exclamation-circle' : 'pi pi-info-circle'" aria-hidden="true"></i>
        <strong>{{ ('ACP.STATE.' + state) | translate }}</strong>
        @if (state === 'pending' || state === 'definition') {
          <p>{{ ('ACP.STATE.' + state + 'Help') | translate }}</p>
        }
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpStateComponent {
  @Input() state: AcpDataState = 'pending';
}
