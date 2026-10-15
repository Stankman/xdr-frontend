import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { VerifyEmailComponent } from './verify-email.component';
import { AuthService } from 'src/app/modules/shared/services/auth.service';

describe('VerifyEmailComponent', () => {
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  function create(token: string | null): VerifyEmailComponent {
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['confirmEmail', 'resendVerification']);
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.resolveTo(true);
    TestBed.configureTestingModule({ providers: [
      { provide: AuthService, useValue: auth },
      { provide: Router, useValue: router },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap(token === null ? {} : { token }) } } }
    ] });
    return TestBed.runInInjectionContext(() => new VerifyEmailComponent());
  }

  afterEach(() => TestBed.resetTestingModule());

  it('confirms the emailed token and removes it from the address bar', () => {
    const component = create('abc');
    auth.confirmEmail.and.returnValue(of(undefined));
    component.ngOnInit();
    expect(auth.confirmEmail).toHaveBeenCalledOnceWith('abc');
    expect(router.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({ queryParams: { token: null }, replaceUrl: true }));
    expect(component.state).toBe('verified');
  });

  it('offers a new link when the token is missing or rejected', () => {
    let component = create(null);
    component.ngOnInit();
    expect(auth.confirmEmail).not.toHaveBeenCalled();
    expect(component.state).toBe('failed');
    TestBed.resetTestingModule();
    component = create('used');
    auth.confirmEmail.and.returnValue(throwError(() => new Error('expired')));
    component.ngOnInit();
    expect(component.state).toBe('failed');
  });

  it('validates the email before resending', () => {
    const component = create(null);
    auth.resendVerification.and.returnValue(of(undefined));
    component.resend();
    expect(auth.resendVerification).not.toHaveBeenCalled();
    expect(component.email.touched).toBeTrue();
    component.email.setValue('player@example.com');
    component.resend();
    expect(auth.resendVerification).toHaveBeenCalledOnceWith('player@example.com');
    expect(component.resent).toBeTrue();
    expect(component.resending).toBeFalse();
  });
});
