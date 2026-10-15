import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputPasswordModule } from 'primeng/inputpassword';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    TranslateModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    InputPasswordModule,
    ProgressBarModule,
    SharedModule
  ],
  declarations: [RegisterComponent]
})
export class RegisterModule { }
