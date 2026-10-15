import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { AcpStateComponent } from '../../ui/acp-state.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [TranslateModule, AcpStateComponent, RouterModule.forChild([{ path: '', component: DashboardComponent }])]
})
export class DashboardModule {}
