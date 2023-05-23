import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { WebComponent } from './modules/web/web.component';
import { AcpComponent } from './modules/acp/acp.component';
import { unauthenticatedAccess, unauthenticatedChildAccess } from './guards/unauthenticated.guard';

const routes: Routes = [
  {
    path: '',
    component: WebComponent,
    loadChildren: () => import('./modules/web/web.module').then((m) => m.WebModule)
  },
  {
    path: 'acp',
    component: AcpComponent,
    loadChildren: () => import('./modules/acp/acp.module').then((m) => m.AcpModule),
    canActivate: [unauthenticatedAccess],
    canActivateChild: [unauthenticatedChildAccess]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: QuicklinkStrategy,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }