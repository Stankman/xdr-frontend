import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomComponent, RoomsComponent } from './rooms.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: RoomsComponent },
    { path: ':id', component: RoomComponent, data: { pageLabel: 'ACP.ROOM_DETAILS', detail: true } }
  ])]
})
export class RoomsModule {}
