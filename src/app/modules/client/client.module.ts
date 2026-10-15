import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientComponent } from './client.component';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ClientButtonsComponent } from '../shared/layout/client/client-buttons/client-buttons.component';
import { ClientNitroComponent } from '../shared/layout/client/client-nitro/client-nitro.component';

@NgModule({
  declarations: [
    ClientComponent,
    ClientButtonsComponent,
    ClientNitroComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    ButtonModule
  ],
  exports: [
    ClientComponent
  ]
})
export class ClientModule { }
