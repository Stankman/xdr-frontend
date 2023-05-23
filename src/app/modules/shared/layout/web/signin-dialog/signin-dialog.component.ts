import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { ApiError } from 'src/app/modules/core/models/api/api-error.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'xdr-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.css'],
  providers: [
    DialogService
  ]
})
export class SignInDialogComponent implements OnInit {
  public formGroup : FormGroup;

  constructor(
    private readonly ref: DynamicDialogRef,
    private readonly formBuilder : FormBuilder,
    private readonly translateService : TranslateService,
    private readonly authService : AuthService,
    private readonly accountService : AccountService,
    private readonly router : Router,
    private readonly messageService : MessageService
  ) { }

  ngOnInit() : void {
    this.formGroup = this.formBuilder.group({
      identification: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() : void {
    if(this.formGroup.invalid) {
      this.form['identification'].markAsDirty();
      this.form['password'].markAsDirty();
      this.messageService.add({severity:'error', summary: 'Oops!', detail: this.translateService.instant('ERROR.INPUT.REQUIRED')});
      return;
    }

    const subscription : Subscription = this.authService.signIn(
      this.form['identification'].value,
      this.form['password'].value
    ).subscribe({
      next: (JWT : string) => {
        const userSubscription : Subscription = this.accountService.getAccountByJWT(JWT).subscribe({
          next: (res) => {
            this.router.navigateByUrl('/me');
            this.messageService.add({severity:'success', summary: 'Welcome Back!', detail: this.translateService.instant('SUCCESS.LOGIN')});
            this.ref.close();
          }
        });
      },
      error: (exception : ApiError) => {
          this.form['identification'].markAsPristine();
          this.form['password'].markAsPristine();
          this.messageService.add({severity:'error', summary: 'Oops!', detail: this.translateService.instant('ERROR.LOGIN')});
          return;
      },
      complete: () => subscription.unsubscribe()
    });
  }

  openPasswordDialog() {
    
  }

  public get form() {
    return this.formGroup.controls;
  }

}
