import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignInDialogComponent } from '../signin-dialog/signin-dialog.component';
import { ThemeService } from '../../../services/theme.service';
import { finalize } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/modules/core/models/account/account.model';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'xdr-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    providers: [
        DialogService
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HeaderComponent implements OnInit {
  public readonly hotelName = environment.app.hotelName;
  public account : Account;
  public ref: DynamicDialogRef = new DynamicDialogRef;
  public mainMenuItems : MenuItem[] = [];
  public isDark : boolean = false;
  public currentLanguage : string = 'en';
  public isLogged : boolean = false;
  public toggle : boolean = false;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly dialogService : DialogService,
    private readonly themeService : ThemeService,
    private readonly accountService : AccountService,
    private readonly translateService : TranslateService,
    private readonly languageService: LanguageService,
    private readonly authService : AuthService,
    private readonly messages: MessageService,
    private readonly router : Router
  ) { }

  ngOnInit() {
    this.isDark = this.themeService.getTheme();
    this.currentLanguage = this.languageService.language;
    this.account = this.accountService.account;

    this.translateService.onLangChange.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateMenuItems(this.account));
    this.accountService.accountObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (account : Account) => {
        if(account) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }

        this.account = account;

        this.updateMenuItems(account);
      }
    });
  }

  private updateMenuItems(account : Account) {
    const hasAvatar = !!account?.activeAvatar;
    this.mainMenuItems = [
      {
        label: account?.activeAvatar?.username,
        routerLink: '/me',
        visible: this.isLogged && hasAvatar
      },
      {
        label: this.translateService.instant('HEADER.MENU.COMMUNITY'),
        routerLink: '/community'
      },
      {
        label: this.translateService.instant('HEADER.MENU.NEWS'),
        routerLink: '/articles'
      },
      {
        label: this.translateService.instant('HEADER.MENU.TEAM'),
        routerLink: '/team',
        visible: this.isLogged && hasAvatar
      },
      {
        label: this.translateService.instant('HEADER.MENU.HOF'),
        routerLink: '/hall-of-fame'
      },
      {
        label: this.translateService.instant('HEADER.MENU.SHOP'),
        routerLink: '/shop',
        visible: this.isLogged && hasAvatar
      }
    ].filter(item => item.visible !== false);
  }

  public show() {
    this.ref = this.dialogService.open(SignInDialogComponent, {
      modal: true,
      closable: true,
      closeOnEscape: true,
      showHeader: true,
      closeAriaLabel: this.translateService.instant('COMMON.CLOSE'),
      dismissableMask: true,
      styleClass: 'login-dialog',
      width: '52rem',
      style: { maxWidth: 'calc(100vw - 2rem)', maxHeight: 'calc(100dvh - 2rem)' }
    });

    this.destroyRef.onDestroy(() => this.ref?.close());
  }

  public signOut() {
    this.authService.signOut().pipe(finalize(() => this.router.navigateByUrl('/'))).subscribe({
      error: () => this.messages.add({
        severity: 'warn',
        summary: this.translateService.instant('ERROR.LOGOUT_LOCAL')
      })
    });
  }

  public onThemeChange(event) {
    this.themeService.setTheme(event.checked);
  }

  public onLocaleChange(event) {
    this.languageService.language = event.value;
    this.updateMenuItems(this.account);
  }
}
