import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedModule } from '../../../shared.module';
import { AuthService } from '../../../services/auth.service';
import { AccountService } from '../../../services/account.service';
import { SignInDialogComponent } from './signin-dialog.component';

describe('SignInDialogComponent', () => {
  let fixture: ComponentFixture<SignInDialogComponent>;
  let ref: jasmine.SpyObj<DynamicDialogRef>;
  let messages: MessageService;
  let auth: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    ref = jasmine.createSpyObj<DynamicDialogRef>('DynamicDialogRef', ['close']);
    auth = jasmine.createSpyObj<AuthService>('AuthService', ['signIn']);

    await TestBed.configureTestingModule({
      imports: [SharedModule, NoopAnimationsModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        MessageService,
        { provide: DynamicDialogRef, useValue: ref },
        { provide: AuthService, useValue: auth },
        { provide: AccountService, useValue: jasmine.createSpyObj('AccountService', ['getAccountByJWT', 'clearSession']) }
      ]
    }).compileComponents();

    messages = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(SignInDialogComponent);
    fixture.detectChanges();
  });

  it('renders the hotel art panel and labelled sign-in form', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.signin-art')?.getAttribute('aria-hidden')).toBe('true');
    expect(element.querySelector('.signin-art-frank')?.getAttribute('src')).toBe('/assets/resources/images/frank_6.gif');
    expect(element.querySelector('.signin-panel')?.getAttribute('aria-labelledby')).toBe('signin-title');
    expect(element.querySelector('label[for="email"]')).not.toBeNull();
    expect(element.querySelector('#signin-password')).not.toBeNull();
    expect(element.querySelector('.signin-link')?.getAttribute('type')).toBe('button');
  });

  it('keeps the dark art treatment and uses a brighter blue with white copy in light mode', () => {
    const originalBodyClass = document.body.className;
    const art = fixture.nativeElement.querySelector('.signin-art') as HTMLElement;
    const eyebrow = fixture.nativeElement.querySelector('.signin-eyebrow') as HTMLElement;
    const title = fixture.nativeElement.querySelector('.signin-art-title') as HTMLElement;
    try {
      document.body.className = 'dark';
      expect(getComputedStyle(art).backgroundColor).toBe('rgb(16, 43, 64)');

      document.body.className = 'light';
      const background = getComputedStyle(art).backgroundImage;
      expect(background).toContain('rgb(7, 89, 133)');
      expect(background).toContain('rgb(37, 99, 235)');
      expect(getComputedStyle(eyebrow).color).toBe('rgb(255, 255, 255)');
      expect(getComputedStyle(title).color).toBe('rgb(255, 255, 255)');
    } finally {
      document.body.className = originalBodyClass;
    }
  });

  it('closes the dialog when navigating to registration', () => {
    const link = fixture.nativeElement.querySelector('.signin-footer a') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/registration');

    link.click();

    expect(ref.close).toHaveBeenCalled();
  });

  it('shares the green finish and keeps a loading submit disabled and stationary', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.signin-submit');
    expect(button.classList.contains('web-green-button')).toBeTrue();
    expect(getComputedStyle(button).backgroundColor).toBe('rgb(0, 129, 62)');
    expect(getComputedStyle(button).borderRadius).toBe('12px');
    fixture.componentInstance.submitting = true;
    fixture.detectChanges();
    expect(button.disabled).toBeTrue();
    expect(getComputedStyle(button).transform).toBe('none');
    expect(getComputedStyle(button).opacity).toBe('0.4');
    expect(button.querySelector('.p-button-loading-icon')).not.toBeNull();
  });

  it('flags invalid fields without calling the API', () => {
    const add = spyOn(messages, 'add');

    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));

    expect(auth.signIn).not.toHaveBeenCalled();
    expect(add).toHaveBeenCalledWith(jasmine.objectContaining({ severity: 'error' }));
    expect(fixture.componentInstance.form['email'].dirty).toBeTrue();
  });
});
