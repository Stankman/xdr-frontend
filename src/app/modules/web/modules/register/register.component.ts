import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { matchValidator } from './validators/confirm-password.validator';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RegisterComponent implements OnInit {
  public readonly hotelName = environment.app.hotelName;
  public formGroup: FormGroup;
  public submitting = false;
  public resending = false;
  public registeredEmail: string | null = null;
  public passwordMasked = true;
  public confirmationMasked = true;

  public get passwordStrength() {
    const value: string = this.form['password'].value;
    if (!value) return { level: 'PROMPT', percent: 0, color: 'var(--p-surface-400)' };
    const score = [
      value.length >= 8,
      value.length >= 12,
      /[A-Z]/.test(value) && /[a-z]/.test(value),
      /[0-9]/.test(value),
      /[^a-zA-Z0-9]/.test(value)
    ].filter(Boolean).length;
    if (score <= 1) return { level: 'WEAK', percent: 25, color: 'var(--p-red-500)' };
    if (score <= 2) return { level: 'MEDIUM', percent: 50, color: 'var(--p-orange-500)' };
    if (score <= 3) return { level: 'STRONG', percent: 75, color: 'var(--p-green-500)' };
    return { level: 'VERY_STRONG', percent: 100, color: 'var(--p-green-500)' };
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly translate: TranslateService,
    private readonly auth: AuthService,
    private readonly messages: MessageService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), matchValidator('passwordConfirm', true), Validators.pattern('^(?=.*[0-9-=?!@:.])(?=.*[a-zA-Z]).{6,}$')]],
      passwordConfirm: ['', [Validators.required, matchValidator('password')]],
      tos: [false, Validators.requiredTrue]
    });
  }

  public onSubmit(): void {
    if (this.submitting) return;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    this.submitting = true;
    const email: string = this.form['email'].value.trim();
    this.auth.signUp(email, this.form['password'].value).pipe(
      finalize(() => this.submitting = false)
    ).subscribe({
      next: () => {
        this.registeredEmail = email;
        this.formGroup.reset({ email: '', password: '', passwordConfirm: '', tos: false });
      },
      error: (error: unknown) => {
        const duplicate = error instanceof HttpErrorResponse && error.status === 409;
        this.messages.add({
          severity: 'error',
          summary: this.translate.instant(duplicate ? 'ERROR.EMAIL_TAKEN' : 'ERROR.REGISTER')
        });
      }
    });
  }

  public resendVerification(): void {
    if (this.resending || !this.registeredEmail) return;
    this.resending = true;
    this.auth.resendVerification(this.registeredEmail).pipe(
      finalize(() => this.resending = false)
    ).subscribe({
      next: () => this.messages.add({ severity: 'success', summary: this.translate.instant('REGISTER.VERIFY.RESENT') }),
      error: () => this.messages.add({ severity: 'error', summary: this.translate.instant('REGISTER.VERIFY.RESEND_FAILED') })
    });
  }

  public startOver(): void {
    this.registeredEmail = null;
  }

  public get form() { return this.formGroup.controls; }
}
