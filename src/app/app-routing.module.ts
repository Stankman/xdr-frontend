import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';
import { unauthenticatedAccess, unauthenticatedChildAccess } from './guards/unauthenticated.guard';
import { ClientComponent } from './modules/client/client.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/web/web.module').then((m) => m.WebModule)
  },
  {
    path: 'acp',
    loadChildren: () => import('./modules/acp/acp.module').then((m) => m.AcpModule),
    canActivate: [unauthenticatedAccess],
    canActivateChild: [unauthenticatedChildAccess]
  },
  {
    path: 'client',
    loadChildren: () => import('./modules/client/client-routing.module').then((m) => m.ClientRoutingModule),
    canActivate: [unauthenticatedAccess],
    canActivateChild: [unauthenticatedChildAccess]
  },
  {
    path: '**',
    redirectTo: 'not-found'
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