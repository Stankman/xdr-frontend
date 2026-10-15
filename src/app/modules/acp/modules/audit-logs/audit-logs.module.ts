import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AcpWorkspaceComponent } from '../../../shared/layout/acp/workspace/workspace.component';

@NgModule({
  imports: [AcpWorkspaceComponent, RouterModule.forChild([{ path: '', component: AcpWorkspaceComponent }])]
})
export class AuditLogsModule {}
