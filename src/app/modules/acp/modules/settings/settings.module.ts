import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AcpWorkspaceComponent } from '../../../shared/layout/acp/workspace/workspace.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', pathMatch: 'full', redirectTo: 'web' },
    { path: 'web', component: AcpWorkspaceComponent, data: { pageLabel: 'ACP.WEB_SETTINGS' } },
    { path: 'hotel', component: AcpWorkspaceComponent, data: { pageLabel: 'ACP.HOTEL_SETTINGS' } }
  ])]
})
export class SettingsModule {}
