import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AcpStateComponent } from './acp-state.component';

@Component({
  selector: 'xdr-acp-pending-form',
  imports: [RouterModule, TranslateModule, ButtonModule, AcpStateComponent],
  template: `
    <a class="acp-back" routerLink=".." queryParamsHandling="preserve">{{ 'ACP.BACK_LIST' | translate }}</a>
    <section class="acp-panel">
      <h2>{{ heading | translate }}</h2>
      @if (player) {
        <p>{{ 'ACP.PLAYER_CONTEXT' | translate }}: <strong>#{{ player }}</strong></p>
        <p class="acp-muted">{{ 'ACP.PLAYER_UNVERIFIED' | translate }}</p>
      }
      <xdr-acp-state state="definition" />
      <p id="acp-form-help" class="acp-muted">{{ 'ACP.FORM_PENDING' | translate }}</p>
      <button pButton type="button" disabled aria-describedby="acp-form-help">{{ 'ACP.SAVE' | translate }}</button>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpPendingFormComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  get player(): string | null { return this.params().get('player'); }
  @Input({ required: true }) heading = '';
}
