import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModerationComponent, TicketComponent } from './moderation.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ModerationComponent },
    { path: ':id', component: TicketComponent, data: { pageLabel: 'ACP.TICKET_DETAILS', detail: true } }
  ])]
})
export class ModerationModule {}
