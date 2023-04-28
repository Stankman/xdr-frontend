import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebComponent } from './web.component';
import { TranslateModule } from '@ngx-translate/core';
import { WebRoutingModule } from './web-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HallOfFameComponent } from './modules/hall-of-fame/hall-of-fame.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    SharedModule,
    WebRoutingModule
  ],
  declarations: [WebComponent, HallOfFameComponent]
})
export class WebModule { }
