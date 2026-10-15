import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BanComponent, BansComponent, CreateBanComponent } from './bans.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: BansComponent },
    { path: 'new', component: CreateBanComponent, data: { pageLabel: 'ACP.CREATE_BAN' } },
    { path: ':id', component: BanComponent, data: { pageLabel: 'ACP.BAN_DETAILS', detail: true } }
  ])]
})
export class BansModule {}
