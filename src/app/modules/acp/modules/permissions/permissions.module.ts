import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PermissionGroupComponent, PermissionGroupsComponent } from './permissions.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', pathMatch: 'full', redirectTo: 'hotel' },
    { path: 'hotel', component: PermissionGroupsComponent, data: { pageLabel: 'ACP.HOTEL_GROUPS' } },
    { path: 'hotel/:id', component: PermissionGroupComponent, data: { pageLabel: 'ACP.HOTEL_GROUPS', scope: 'hotel', detail: true } },
    { path: 'web', component: PermissionGroupsComponent, data: { pageLabel: 'ACP.WEB_GROUPS' } },
    { path: 'web/:id', component: PermissionGroupComponent, data: { pageLabel: 'ACP.WEB_GROUPS', scope: 'web', detail: true } }
  ])]
})
export class PermissionsModule {}
