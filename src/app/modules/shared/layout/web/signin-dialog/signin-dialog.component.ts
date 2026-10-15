import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { finalize, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'xdr-signin-dialog',
    templateUrl: './signin-dialog.component.html',
    styleUrls: ['./signin-dialog.component.scss'],
    providers: [
        DialogService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SignInDialogComponent implements OnInit {
  public formGroup : FormGroup;
  public submitting = false;
  public readonly hotelName = environment.app.hotelName;

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
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() : void {
    if (this.submitting) return;
    if(this.formGroup.invalid) {
      this.form['email'].markAsDirty();
      this.form['password'].markAsDirty();
      this.messageService.add({severity:'error', summary: this.translateService.instant('ERROR.INPUT.REQUIRED')});
      return;
    }

    this.submitting = true;
    this.authService.signIn(
      this.form['email'].value,
      this.form['password'].value
    ).pipe(
      switchMap(token => this.accountService.getAccountByJWT(token)),
      finalize(() => this.submitting = false)
    ).subscribe({
      next: () => {
            this.router.navigateByUrl(this.accountService.account?.activeAvatar ? '/me' : '/articles');
            this.messageService.add({severity:'success', summary: this.translateService.instant('ME.WELCOME'), detail: this.translateService.instant('SUCCESS.LOGIN')});
            this.ref.close();
      },
      error: (error: unknown) => {
          this.accountService.clearSession();
          const unverified = error instanceof HttpErrorResponse && error.status === 403;
          this.messageService.add({severity:'error', summary: this.translateService.instant(unverified ? 'ERROR.EMAIL_NOT_VERIFIED' : 'ERROR.LOGIN')});
          return;
      }
    });
  }

  close() : void {
    this.ref.close();
  }

  openPasswordDialog() {
    
  }

  public get form() {
    return this.formGroup.controls;
  }

}
