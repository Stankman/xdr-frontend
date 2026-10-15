import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'xdr-acp-sub-sidebar',
  imports: [RouterModule, TranslateModule],
  template: `
    <aside id="acp-submenu" class="acp-sub-sidebar" [class.is-open]="open"
           [attr.aria-label]="title">
      <div class="acp-channel-heading">
        <strong>{{ title }}</strong>
        <span>{{ ('ACP.' + group) | translate }}</span>
      </div>
      <nav [attr.aria-label]="'ACP.SUBMENU' | translate">
        @for (item of items; track item.path) {
          <a [routerLink]="item.path ? ['/acp', path, item.path] : ['/acp', path]" routerLinkActive="active"
             ariaCurrentWhenActive="page">
            <span aria-hidden="true">#</span>{{ item.label | translate }}
          </a>
        }
      </nav>
      <p class="acp-channel-note">{{ 'ACP.WORKSPACE_NOTE' | translate }}</p>
    </aside>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpSubSidebarComponent {
  @Input({ required: true }) title = '';
  @Input({ required: true }) path = '';
  @Input({ required: true }) group = '';
  @Input() items: readonly { path: string; label: string }[] = [];
  @Input() open = false;
}
