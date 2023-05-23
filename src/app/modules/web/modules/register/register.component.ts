import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { matchValidator } from './validators/confirm-password.validator';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ApiError } from 'src/app/modules/core/models/api/api-error.model';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { AccountService } from 'src/app/modules/shared/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public formGroup : FormGroup;

  constructor(
    private readonly formBuilder : FormBuilder,
    private readonly translateService : TranslateService,
    private readonly authService : AuthService,
    private readonly accountService : AccountService,
    private readonly messageService : MessageService
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), matchValidator('passwordConfirm', true), Validators.pattern('^(?=.*[0-9-=?!@:.])(?=.*[a-zA-Z]).{6,}$')]],
      passwordConfirm: ['', [Validators.required, matchValidator('password')]],
      tos: [false, [Validators.required, Validators.requiredTrue]]
    });
  }

  public onSubmit() : void {
    if(this.formGroup.invalid) {
      if(this.form['email'].errors) {
        this.form['email'].markAsDirty();
      }

      if(this.form['password'].errors) {
        this.form['password'].markAsDirty();
      }

      if(this.form['passwordConfirm'].errors) {
        console.log(this.form['passwordConfirm'].errors);
        this.form['passwordConfirm'].markAsDirty();
      }

      if(this.form['tos'].errors) {
        this.form['tos'].markAsDirty();
      }
    }

    const authSubscription : Subscription = this.authService.signUp(
      this.form['email'].value,
      this.form['password'].value
    ).subscribe({
      next: (JWT : string) => {
        const userSubscription : Subscription = this.accountService.getAccountByJWT(JWT).subscribe();
        this.messageService.add({severity:'success', summary: 'Welcome Back!', detail: this.translateService.instant('SUCCESS.LOGIN')});
      },
      error: (exception : ApiError) => {
          this.formGroup.markAsPristine();
          this.messageService.add({severity:'error', summary: 'Oops!', detail: this.translateService.instant('ERROR.LOGIN')});
          return;
      },
      complete: () => authSubscription.unsubscribe()
    });
  }

  public get form() {
    return this.formGroup.controls;
  }

}
