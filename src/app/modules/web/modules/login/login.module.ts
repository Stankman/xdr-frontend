import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    LoginRoutingModule,
    SharedModule
  ]
})
export class LoginModule { }
