import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApiError } from 'src/app/modules/core/models/api/api-error.model';

@Component({
  selector: 'xdr-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.css'],
  providers: [
    DialogService
  ]
})
export class SignInDialogComponent implements OnInit {

  public ref: DynamicDialogRef = new DynamicDialogRef;

  public form : FormGroup;

  constructor(
    private dialogService : DialogService,
    private formBuilder : FormBuilder,
    private translateService : TranslateService,
    private authService : AuthService,
    private accountService : AccountService,
    private messageService : MessageService
  ) { }

  ngOnInit() : void {
    this.form = this.formBuilder.group({
      identification: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() : void {
    if(this.form.invalid) {
      this.form.controls['identification'].markAsDirty();
      this.form.controls['password'].markAsDirty();
      this.messageService.add({severity:'error', summary: 'Oops!', detail: this.translateService.instant('ERROR.INPUT.REQUIRED')});
      return;
    }

    const subscription = this.authService.signIn(
      this.form.controls['identification'].value,
      this.form.controls['password'].value
    ).subscribe({
      next: (JWT : string) => {
        this.messageService.add({severity:'success', summary: 'Welcome Back!', detail: this.translateService.instant('SUCCESS.LOGIN')});
      },
      error: (exception : ApiError) => {
          this.form.controls['identification'].markAsPristine();
          this.form.controls['password'].markAsPristine();
          this.messageService.add({severity:'error', summary: 'Oops!', detail: this.translateService.instant('ERROR.LOGIN')});
          return;
      }
    })
  }

  openPasswordDialog() {
    
  }

}
