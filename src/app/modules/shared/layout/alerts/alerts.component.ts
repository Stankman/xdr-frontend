import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastMessageOptions } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export type AlertTone = 'success' | 'info' | 'warn' | 'error';

const ICONS: Record<AlertTone, string> = {
  success: 'pi pi-check',
  info: 'pi pi-info',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-times'
};

@Component({
  selector: 'xdr-alerts',
  templateUrl: './alerts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastModule, TranslateModule]
})
export class AlertsComponent {
  public readonly life = 4500;

  public tone(message: ToastMessageOptions | null | undefined): AlertTone {
    const severity = message?.severity;
    return severity === 'success' || severity === 'warn' || severity === 'error' ? severity : 'info';
  }

  public icon(tone: AlertTone): string {
    return ICONS[tone];
  }

  public mascot(tone: AlertTone): string {
    return tone === 'error'
      ? '/assets/resources/images/frank_4.gif'
      : '/assets/resources/images/frank_2.gif';
  }

  public duration(message: ToastMessageOptions | null | undefined): number | null {
    return message?.sticky ? null : (message?.life || this.life);
  }
}
