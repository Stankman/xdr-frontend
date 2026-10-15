import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AcpStateComponent } from '../../../../acp/ui/acp-state.component';

@Component({
  selector: 'xdr-acp-workspace',
  templateUrl: './workspace.component.html',
  imports: [TranslateModule, AcpStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpWorkspaceComponent {
  private readonly route = inject(ActivatedRoute);
  public readonly title: string = this.route.snapshot.data['pageLabel'] ?? this.route.snapshot.data['label'];
  public readonly icon: string = this.route.snapshot.data['icon'];
}
