import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ClientRoutingModule } from './client-routing.module';

@NgModule({
  declarations: [
    ClientComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  exports: [
    ClientComponent
  ]
})
export class ClientModule { }
