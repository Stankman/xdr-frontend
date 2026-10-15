import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerComponent, PlayersComponent } from './players.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: PlayersComponent },
    { path: ':id', component: PlayerComponent, data: { pageLabel: 'ACP.PLAYER_DETAILS', detail: true } }
  ])]
})
export class PlayersModule {}
