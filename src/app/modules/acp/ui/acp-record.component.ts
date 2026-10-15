import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AcpStateComponent } from './acp-state.component';
import { AcpDemoService } from '../acp-demo.service';

@Component({
  selector: 'xdr-acp-record',
  imports: [RouterModule, TranslateModule, ButtonModule, AcpStateComponent],
  template: `
    <a class="acp-back" routerLink=".." queryParamsHandling="preserve">
      <i class="pi pi-arrow-left" aria-hidden="true"></i>{{ 'ACP.BACK_LIST' | translate }}
    </a>
    <section class="acp-panel">
      <h2>{{ 'ACP.RECORD_DATA' | translate }}</h2>
      <xdr-acp-state [state]="demoState" />
      @if (fields.length && demoState !== 'notFound') {
        <dl class="acp-record-fields">
          @for (field of fields; track field) {
            <div><dt>{{ field | translate }}</dt><dd>
              {{ demoRecord?.values?.[field] ?? ('ACP.UNAVAILABLE' | translate) }}
            </dd></div>
          }
        </dl>
      }
      @if ((actions.length || banPlayer) && demoState !== 'notFound') {
        <div class="acp-record-actions">
          @for (action of actions; track action) {
            <button pButton type="button" disabled aria-describedby="acp-actions-help">{{ action | translate }}</button>
          }
          @if (banPlayer) {
            <a class="acp-action-link" routerLink="/acp/bans/new"
              [queryParams]="{player: playerId}">{{ 'ACP.BAN_PLAYER' | translate }}</a>
          }
        </div>
        <p id="acp-actions-help" class="acp-muted">{{ 'ACP.FORM_PENDING' | translate }}</p>
      }
    </section>
    <div class="acp-detail-grid">
      @for (collection of collections; track collection) {
        <section class="acp-panel">
          <h2>{{ collection | translate }}</h2>
          @if (demoRecord; as record) {
            @if (record.collections[collection]; as entries) {
              @if (entries.length) {
                <ul class="acp-demo-entries">
                  @for (entry of entries; track $index) {
                    <li>
                      @if (entry.link) { <a [routerLink]="entry.link">{{ entry.text }}</a> }
                      @else { {{ entry.text }} }
                    </li>
                  }
                </ul>
              } @else { <xdr-acp-state state="empty" /> }
            } @else { <xdr-acp-state /> }
          } @else { <xdr-acp-state [state]="demoState" /> }
        </section>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpRecordComponent {
  private readonly demo = inject(AcpDemoService);
  private readonly route = inject(ActivatedRoute);
  private readonly params = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  get playerId(): string | null { return this.params().get('id'); }
  @Input() fields: readonly string[] = [];
  @Input() collections: readonly string[] = [];
  @Input() actions: readonly string[] = [];
  @Input() banPlayer = false;
  @Input() demoPath = '';
  get demoRecord() { return this.demo.record(this.demoPath, this.playerId); }
  get demoState() {
    return this.demo.list(this.demoPath) ? (this.demoRecord ? 'ready' : 'notFound') : 'pending';
  }
}
