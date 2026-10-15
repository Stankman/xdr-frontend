import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountComponent, AccountsComponent } from './accounts.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AccountsComponent },
    { path: ':id', component: AccountComponent, data: { pageLabel: 'ACP.ACCOUNT_DETAILS', detail: true } }
  ])]
})
export class AccountsModule {}
