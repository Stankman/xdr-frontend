import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    TranslateModule.forChild(),
    SharedModule
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
