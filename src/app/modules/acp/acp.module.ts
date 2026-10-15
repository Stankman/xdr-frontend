import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcpComponent } from './acp.component';
import { AcpRoutingModule } from './acp-routing.module';
import { AcpSidebarComponent } from '../shared/layout/acp/sidebar/sidebar.component';
import { AcpSubSidebarComponent } from '../shared/layout/acp/sub-sidebar/sub-sidebar.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    AcpRoutingModule,
    AcpSidebarComponent,
    AcpSubSidebarComponent,
    TranslateModule
  ],
  declarations: [AcpComponent]
})
export class AcpModule { }
