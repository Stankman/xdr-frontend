import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export const CURRENCY_ADDED_MESSAGE =
  'Currency added to the database. Add it to `external_variables` to make it available in the hotel.';

@Component({
  selector: 'xdr-acp-feedback',
  template: `
    @if (message) {
      <p class="acp-feedback" [class.acp-feedback-error]="kind === 'error'"
         [attr.role]="kind === 'error' ? 'alert' : 'status'">{{ message }}</p>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpFeedbackComponent {
  @Input() message = '';
  @Input() kind: 'success' | 'error' = 'success';
}
