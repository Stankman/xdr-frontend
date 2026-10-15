import { FormBuilder } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, Subject, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { AuthService } from 'src/app/modules/shared/services/auth.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let auth: jasmine.SpyObj<AuthService>;
  let messages: jasmine.SpyObj<MessageService>;
  let translate: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['signUp', 'resendVerification']);
    messages = jasmine.createSpyObj('MessageService', ['add']);
    translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.callFake(key => key);
    component = new RegisterComponent(new FormBuilder(), translate, auth, messages);
    component.ngOnInit();
  });

  function validForm(): void {
    component.formGroup.setValue({ email: 'test@example.com', password: 'test123', passwordConfirm: 'test123', tos: true });
  }

  it('reads the configured hotel name instead of a hardcoded brand', () => {
    const original = environment.app.hotelName;
    try {
      environment.app.hotelName = 'Test Hotel';
      const branded = new RegisterComponent(new FormBuilder(), translate, auth, messages);
      expect(branded.hotelName).toBe('Test Hotel');
    } finally {
      environment.app.hotelName = original;
    }
  });

  it('keeps the dark intro and uses a brighter blue gradient with white copy in light mode', async () => {
    const originalBodyClass = document.body.className;
    const authStub = jasmine.createSpyObj<AuthService>('AuthService', ['signUp', 'resendVerification']);
    const messageStub = jasmine.createSpyObj<MessageService>('MessageService', ['add']);
    const translateStub = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translateStub.instant.and.callFake(key => key);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        FormBuilder,
        { provide: TranslateService, useValue: translateStub },
        { provide: AuthService, useValue: authStub },
        { provide: MessageService, useValue: messageStub }
      ]
    });
    TestBed.overrideComponent(RegisterComponent, {
      set: {
        template: `
          <section class="registration-intro">
            <span class="registration-eyebrow">Welcome</span>
            <h1>Join the hotel</h1>
            <p>Explore the world</p>
          </section>
        `
      }
    });
    await TestBed.compileComponents();

    let fixture: ComponentFixture<RegisterComponent> | undefined;
    try {
      fixture = TestBed.createComponent(RegisterComponent);
      fixture.detectChanges();
      const intro = fixture.nativeElement.querySelector('.registration-intro') as HTMLElement;
      const eyebrow = fixture.nativeElement.querySelector('.registration-eyebrow') as HTMLElement;
      const heading = fixture.nativeElement.querySelector('h1') as HTMLElement;
      const paragraph = fixture.nativeElement.querySelector('p') as HTMLElement;

      document.body.className = 'dark';
      expect(getComputedStyle(intro).backgroundImage).toContain('rgb(35, 100, 135)');

      document.body.className = 'light';
      const background = getComputedStyle(intro).backgroundImage;
      expect(background).toContain('rgb(7, 89, 133)');
      expect(background).toContain('rgb(37, 99, 235)');
      expect(getComputedStyle(eyebrow).color).toBe('rgb(255, 255, 255)');
      expect(getComputedStyle(heading).color).toBe('rgb(255, 255, 255)');
      expect(getComputedStyle(paragraph).color).toBe('rgb(255, 255, 255)');
    } finally {
      fixture?.destroy();
      document.body.className = originalBodyClass;
      TestBed.resetTestingModule();
    }
  });

  it('never sends an invalid registration', () => {
    component.onSubmit();
    expect(auth.signUp).not.toHaveBeenCalled();
    expect(component.formGroup.touched).toBeTrue();
    validForm();
    component.form['passwordConfirm'].setValue('different');
    component.onSubmit();
    expect(auth.signUp).not.toHaveBeenCalled();
    validForm();
    component.form['tos'].setValue(false);
    component.onSubmit();
    expect(auth.signUp).not.toHaveBeenCalled();
  });

  it('rates password strength without changing the registration requirements', () => {
    expect(component.passwordStrength.percent).toBe(0);
    const cases = [
      ['test123', 'WEAK', 25],
      ['testing123', 'MEDIUM', 50],
      ['Testing123', 'STRONG', 75],
      ['Testing123!long', 'VERY_STRONG', 100]
    ] as const;
    for (const [password, level, percent] of cases) {
      component.form['password'].setValue(password);
      component.form['passwordConfirm'].setValue(password);
      expect(component.passwordStrength.level).toBe(level);
      expect(component.passwordStrength.percent).toBe(percent);
      expect(component.form['password'].valid).toBeTrue();
    }
    component.form['password'].setValue('');
    expect(component.passwordStrength.level).toBe('PROMPT');
    expect(component.passwordMasked).toBeTrue();
    expect(component.confirmationMasked).toBeTrue();
  });

  it('shows the check-email state after registering and prevents duplicate submissions', () => {
    const response = new Subject<void>();
    auth.signUp.and.returnValue(response);
    validForm();
    component.onSubmit();
    component.onSubmit();
    expect(auth.signUp).toHaveBeenCalledOnceWith('test@example.com', 'test123');
    expect(component.submitting).toBeTrue();
    response.next();
    response.complete();
    expect(component.submitting).toBeFalse();
    expect(component.registeredEmail).toBe('test@example.com');
    expect(component.form['password'].value).toBe('');
    expect(messages.add).not.toHaveBeenCalled();
  });

  it('explains when the email is already registered', () => {
    auth.signUp.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    validForm();
    component.onSubmit();
    expect(component.registeredEmail).toBeNull();
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error', summary: 'ERROR.EMAIL_TAKEN' }));
  });

  it('reports signup errors and unlocks the form', () => {
    auth.signUp.and.returnValue(throwError(() => new Error('Signup unavailable')));
    validForm();
    component.onSubmit();
    expect(component.submitting).toBeFalse();
    expect(component.registeredEmail).toBeNull();
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error', summary: 'ERROR.REGISTER' }));
  });

  it('resends the verification email and can start over', () => {
    auth.resendVerification.and.returnValue(of(undefined));
    component.resendVerification();
    expect(auth.resendVerification).not.toHaveBeenCalled();
    component.registeredEmail = 'test@example.com';
    component.resendVerification();
    expect(auth.resendVerification).toHaveBeenCalledOnceWith('test@example.com');
    expect(component.resending).toBeFalse();
    expect(messages.add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'success', summary: 'REGISTER.VERIFY.RESENT' }));
    component.startOver();
    expect(component.registeredEmail).toBeNull();
  });
});