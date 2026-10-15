import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { providePrimeNG } from 'primeng/config';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenubarModule } from 'primeng/menubar';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { BehaviorSubject, of } from 'rxjs';
import { HeaderComponent } from './header.component';
import { SignInDialogComponent } from '../signin-dialog/signin-dialog.component';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { LanguageService } from '../../../services/language.service';
import { ThemeService } from '../../../services/theme.service';
import { Account } from 'src/app/modules/core/models/account/account.model';

describe('Header login dialog', () => {
  it('provides close button, Escape and mask dismissal with responsive sizing', () => {
    const dialogs = jasmine.createSpyObj<DialogService>('DialogService', ['open']);
    const ref = jasmine.createSpyObj<DynamicDialogRef>('DynamicDialogRef', ['close']);
    dialogs.open.and.returnValue(ref);
    const translate = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translate.instant.and.returnValue('Cerrar');
    TestBed.configureTestingModule({ providers: [
      { provide: DialogService, useValue: dialogs },
      { provide: TranslateService, useValue: translate },
      { provide: ThemeService, useValue: {} },
      { provide: AccountService, useValue: {} },
      { provide: LanguageService, useValue: {} },
      { provide: AuthService, useValue: {} },
      { provide: MessageService, useValue: {} },
      { provide: Router, useValue: {} }
    ] });
    const header = TestBed.runInInjectionContext(() => new HeaderComponent(
      TestBed.inject(DialogService), TestBed.inject(ThemeService),
      TestBed.inject(AccountService), TestBed.inject(TranslateService),
      TestBed.inject(LanguageService), TestBed.inject(AuthService),
      TestBed.inject(MessageService), TestBed.inject(Router)
    ));
    header.show();
    expect(dialogs.open).toHaveBeenCalledOnceWith(SignInDialogComponent, jasmine.objectContaining({
      closable: true, showHeader: true, closeOnEscape: true, dismissableMask: true,
      closeAriaLabel: 'Cerrar', styleClass: 'login-dialog',
      style: { maxWidth: 'calc(100vw - 2rem)', maxHeight: 'calc(100dvh - 2rem)' }
    }));
    TestBed.resetTestingModule();
    expect(ref.close).toHaveBeenCalled();
  });

  it('shows a red ACP link only when the current account has ACP access', async () => {
    const accountSubject = new BehaviorSubject<Account | null>(null);
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        FormsModule, TranslateModule.forRoot(), ButtonModule, MenubarModule,
        RippleModule, RouterModule, SelectModule, ToggleButtonModule
      ],
      providers: [
        provideRouter([{ path: 'acp', children: [] }]),
        provideNoopAnimations(),
        providePrimeNG({ theme: { preset: Aura } }),
        { provide: ThemeService, useValue: { getTheme: () => false } },
        { provide: AccountService, useValue: {
          account: null,
          accountObservable: accountSubject.asObservable()
        } },
        { provide: LanguageService, useValue: { language: 'en' } },
        { provide: AuthService, useValue: {} },
        { provide: MessageService, useValue: {} }
      ]
    });
    await TestBed.compileComponents();
    const fixture = TestBed.createComponent(HeaderComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.web-acp-button')).toBeNull();

    accountSubject.next(Object.assign(new Account(), { permissions: ['cms.articles.manage'] }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.web-acp-button')).toBeNull();

    accountSubject.next(Object.assign(new Account(), { permissions: ['cms.acp.access'] }));
    fixture.detectChanges();
    const header: HTMLElement = fixture.nativeElement;
    const button = header.querySelector<HTMLElement>('.web-acp-button');
    expect(button).not.toBeNull();
    expect(button.textContent).toContain('ACP');
    expect(getComputedStyle(button).backgroundColor).toBe('rgb(174, 28, 82)');
    expect(getComputedStyle(button).borderColor).toBe('rgb(243, 115, 135)');
    button.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/acp');
    fixture.destroy();
  });

  describe('Header theme styling', () => {
    let originalBodyClass: string;

    beforeEach(() => {
      originalBodyClass = document.body.className;
    });

    afterEach(() => {
      TestBed.resetTestingModule();
      document.body.className = originalBodyClass;
    });

    for (const theme of ['light', 'dark']) {
      it(`keeps ${theme} controls transparent and styles active navigation and language options`, async () => {
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);
        const language = { language: 'en' };
        TestBed.configureTestingModule({
          declarations: [HeaderComponent],
          imports: [
            FormsModule, TranslateModule.forRoot(), ButtonModule, MenubarModule,
            RippleModule, SelectModule, ToggleButtonModule
          ],
          providers: [
            provideRouter([{ path: 'community', children: [] }]),
            provideNoopAnimations(),
            providePrimeNG({ theme: { preset: Aura, options: {
              darkModeSelector: 'body.dark',
              cssLayer: { name: 'primeng', order: 'theme, base, primeng, components, utilities' }
            } } }),
            { provide: ThemeService, useValue: { getTheme: () => theme === 'dark' } },
            { provide: AccountService, useValue: { account: null, accountObservable: of(null) } },
            { provide: LanguageService, useValue: language },
            { provide: AuthService, useValue: {} },
            { provide: MessageService, useValue: {} }
          ]
        });
        await TestBed.compileComponents();
        const fixture = TestBed.createComponent(HeaderComponent);
        document.body.appendChild(fixture.nativeElement);
        fixture.detectChanges();
        await TestBed.inject(Router).navigateByUrl('/community');
        await fixture.whenStable();
        fixture.detectChanges();
        const header: HTMLElement = fixture.nativeElement;
        expect(getComputedStyle(header.querySelector<HTMLElement>('.site-header')!).backgroundImage)
          .toContain('linear-gradient');
        const container = header.querySelector<HTMLElement>('.web-container')!;
        const containerStyle = getComputedStyle(container);
        const containerRect = container.getBoundingClientRect();
        expect(containerStyle.maxWidth).toBe('1280px');
        const gutter = parseFloat(containerStyle.paddingInlineStart);
        expect(gutter).toBeGreaterThanOrEqual(16);
        expect(gutter).toBeLessThanOrEqual(48);
        for (const menubar of header.querySelectorAll<HTMLElement>('.p-menubar.web-menubar')) {
          const rect = menubar.getBoundingClientRect();
          expect(getComputedStyle(menubar).backgroundColor).toBe('rgba(0, 0, 0, 0)');
          const rootList = menubar.querySelector<HTMLElement>('.p-menubar-root-list')!;
          const wasMobile = menubar.classList.contains('p-menubar-mobile');
          menubar.classList.remove('p-menubar-mobile');
          expect(getComputedStyle(rootList).backgroundColor).toBe('rgba(0, 0, 0, 0)');
          menubar.classList.add('p-menubar-mobile');
          expect(getComputedStyle(rootList).backgroundColor)
            .toBe(theme === 'dark' ? 'rgb(21, 22, 24)' : 'rgb(255, 255, 255)');
          menubar.classList.toggle('p-menubar-mobile', wasMobile);
          expect(getComputedStyle(menubar).paddingInlineStart).toBe('0px');
          expect(getComputedStyle(menubar).paddingInlineEnd).toBe('0px');
          expect(rect.left).toBeCloseTo(containerRect.left + gutter, 1);
          expect(rect.right).toBeCloseTo(containerRect.right - gutter, 1);
        }
        expect(fixture.componentInstance.mainMenuItems.every(item => item.visible !== false)).toBeTrue();
        const menu = header.querySelectorAll<HTMLElement>('.p-menubar-root-list')[1];
        menu.dispatchEvent(new FocusEvent('focus'));
        menu.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', code: 'Home' }));
        fixture.detectChanges();
        const focusedItem = menu.querySelector<HTMLElement>('.p-menubar-item.p-focus')!;
        expect(focusedItem.textContent).toContain('HEADER.MENU.COMMUNITY');
        expect(menu.getAttribute('aria-activedescendant')).toBe(focusedItem.id);
        expect(getComputedStyle(focusedItem.querySelector<HTMLElement>('.p-menubar-item-content')!).outlineStyle)
          .toBe('solid');
        const signup = header.querySelector<HTMLButtonElement>('button.web-green-button')!;
        expect(signup.getBoundingClientRect().right).toBeCloseTo(containerRect.right - gutter, 1);
        const signupStyle = getComputedStyle(signup);
        expect(signupStyle.backgroundColor).toBe('rgb(0, 129, 62)');
        expect(signupStyle.borderColor).toBe('rgb(142, 218, 85)');
        expect(signupStyle.borderWidth).toBe('2px');
        expect(signupStyle.borderRadius).toBe('12px');
        expect(signupStyle.color).toBe('rgb(255, 255, 255)');
        expect(signupStyle.boxShadow).toBe('rgba(0, 0, 0, 0.267) 0px 3px 0px 0px');
        expect(signupStyle.fontWeight).toBe('700');
        expect(header.querySelector('.p-button-text.web-green-button')).toBeNull();
        const control = header.querySelector<HTMLElement>('.language-dropdown')!;
        const toggle = header.querySelector<HTMLElement>('.theme-button')!;
        const content = toggle.querySelector<HTMLElement>('.p-togglebutton-content')!;
        for (const element of [control, toggle, content]) {
          expect(getComputedStyle(element).backgroundColor).toBe('rgba(0, 0, 0, 0)');
          expect(getComputedStyle(element).boxShadow).toBe('none');
        }
        expect(toggle.classList.contains('p-togglebutton-checked')).toBe(theme === 'dark');
        const activeLink = header.querySelector<HTMLElement>('.p-menubar-item-link-active')!;
        expect(activeLink.getAttribute('href')).toBe('/community');
        expect(getComputedStyle(activeLink.parentElement!).backgroundColor)
          .toBe(theme === 'dark' ? 'rgb(37, 53, 69)' : 'rgb(220, 232, 244)');

        control.click();
        fixture.detectChanges();
        await fixture.whenStable();
        const panel = header.querySelector<HTMLElement>('.header-language-panel')!;
        expect(panel).not.toBeNull();
        expect(getComputedStyle(panel).backgroundColor)
          .toBe(theme === 'dark' ? 'rgb(21, 22, 24)' : 'rgb(255, 255, 255)');
        expect(getComputedStyle(panel).boxShadow).toBe('none');
        const selected = panel.querySelector<HTMLElement>('.p-select-option-selected')!;
        expect(selected.textContent).toContain('English');
        expect(getComputedStyle(selected).color)
          .toBe(theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(73, 80, 87)');
        expect(getComputedStyle(selected).backgroundColor)
          .toBe(theme === 'dark' ? 'rgb(27, 28, 31)' : 'rgb(239, 246, 255)');
        expect(getComputedStyle(selected).outlineStyle).toBe('solid');
        document.body.classList.remove(theme);
        document.body.classList.add(theme === 'dark' ? 'light' : 'dark');
        expect(getComputedStyle(panel).backgroundColor)
          .toBe(theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(21, 22, 24)');
        expect(getComputedStyle(selected).color)
          .toBe(theme === 'dark' ? 'rgb(73, 80, 87)' : 'rgb(255, 255, 255)');
        panel.querySelector<HTMLElement>('.p-select-option:not(.p-select-option-selected)')!.click();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(language.language).toBe('es');
        expect(control.textContent).toContain('Español');
      });
    }
  });
});
