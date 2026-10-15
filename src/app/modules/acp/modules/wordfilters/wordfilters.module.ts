import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AddWordfilterComponent, WordfilterComponent, WordfiltersComponent } from './wordfilters.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: WordfiltersComponent },
    { path: 'new', component: AddWordfilterComponent, data: { pageLabel: 'ACP.ADD_FILTER' } },
    { path: ':id', component: WordfilterComponent, data: { pageLabel: 'ACP.FILTER_DETAILS', detail: true } }
  ])]
})
export class WordfiltersModule {}
