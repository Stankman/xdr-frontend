import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { AuthService } from 'src/app/modules/shared/services/auth.service';

export type VerifyEmailState = 'verifying' | 'verified' | 'failed';

@Component({
  selector: 'xdr-verify-email',
  imports: [RouterLink, TranslateModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  host: { class: 'web-container' },
  changeDetection: ChangeDetectionStrategy.Eager
})
export class VerifyEmailComponent implements OnInit {
  public state: VerifyEmailState = 'verifying';
  public resending = false;
  public resent = false;
  public readonly email = new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] });
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token')?.trim();
    // The token is single-use; keep it out of the address bar and history.
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { token: null },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    if (!token) {
      this.state = 'failed';
      return;
    }
    this.auth.confirmEmail(token).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.state = 'verified',
      error: () => this.state = 'failed'
    });
  }

  public resend(): void {
    if (this.resending) return;
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.resending = true;
    this.resent = false;
    this.auth.resendVerification(this.email.value.trim()).pipe(
      finalize(() => this.resending = false),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({ next: () => this.resent = true, error: () => undefined });
  }
}
