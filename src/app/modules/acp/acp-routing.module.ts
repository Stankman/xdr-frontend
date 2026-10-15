import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcpComponent } from './acp.component';
import { acpSections } from './acp-sections';

const routes: Routes = [{
  path: '',
  component: AcpComponent,
  children: [
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
    ...acpSections.map(({ path, label, icon, loadChildren }) => ({
      path,
      data: { label, icon },
      loadChildren
    })),
    { path: '**', redirectTo: 'dashboard' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcpRoutingModule {}
