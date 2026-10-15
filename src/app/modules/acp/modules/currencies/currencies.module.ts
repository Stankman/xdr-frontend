import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddCurrencyComponent, CurrenciesComponent, CurrencyComponent } from './currencies.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: CurrenciesComponent },
    { path: 'new', component: AddCurrencyComponent, data: { pageLabel: 'ACP.ADD_CURRENCY' } },
    { path: ':id', component: CurrencyComponent, data: { pageLabel: 'ACP.CURRENCY_DETAILS', detail: true } }
  ])]
})
export class CurrenciesModule {}
