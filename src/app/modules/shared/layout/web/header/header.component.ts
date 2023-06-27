import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignInDialogComponent } from '../signin-dialog/signin-dialog.component';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounceInDown, bounceOutUp } from 'ng-animate';
import { ThemeService } from '../../../services/theme.service';
import { Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/modules/core/models/account/account.model';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../services/language.service';

@Component({
  selector: 'xdr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    DialogService
  ],
  animations: [
    trigger('bounceInDown', [transition(':enter', useAnimation(bounceInDown, {
      params: {
        timing: 2
      }
    }))]),
    trigger('bounceOutUp',[transition(':leave', useAnimation(bounceOutUp, {
      params: {
        timing: 2
      }
    }))])
  ]
})
export class HeaderComponent implements OnInit {
  public account : Account;
  public ref: DynamicDialogRef = new DynamicDialogRef;
  public mainMenuItems : MenuItem[] = [];
  public isDark : boolean = false;
  public currentLanguage : string = 'en';
  public isLogged : boolean = false;
  public toggle : boolean = false;

  constructor(
    private readonly dialogService : DialogService,
    private readonly themeService : ThemeService,
    private readonly accountService : AccountService,
    private readonly translateService : TranslateService,
    private readonly languageService: LanguageService,
    private readonly authService : AuthService,
    private readonly router : Router
  ) { }

  ngOnInit() {
    this.isDark = this.themeService.getTheme();
    this.currentLanguage = this.languageService.language;
    this.account = this.accountService.account;

    this.accountService.accountObservable.subscribe({
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
    this.mainMenuItems = [
      {
        label: account?.activeAvatar.username,
        routerLink: 'me',
        visible: this.isLogged
      },
      {
        label: this.translateService.instant('HEADER.MENU.COMMUNITY'),
        routerLink: 'community'
      },
      {
        label: this.translateService.instant('HEADER.MENU.NEWS'),
        routerLink: 'articles'
      },
      {
        label: this.translateService.instant('HEADER.MENU.TEAM'),
        routerLink: 'team',
        visible: this.isLogged
      },
      {
        label: this.translateService.instant('HEADER.MENU.HOF'),
        routerLink: 'hall-of-fame'
      },
      {
        label: this.translateService.instant('HEADER.MENU.SHOP'),
        routerLink: 'shop',
        visible: this.isLogged
      }
    ];
  }

  public show() {
    this.ref = this.dialogService.open(SignInDialogComponent, {
      dismissableMask: true,
      styleClass: 'login-dialog overflow-hidden max-w-30rem sm:w-30rem md:w-30rem sm:border-noround md:border-round',
      height: '80%'
    });

    this.ref.onClose.subscribe();
  }

  public signOut() {
    let signOutSubscription : Subscription = this.authService.signOut().subscribe({
      next: () => {
        this.router.navigateByUrl('/');
      },
      complete: () => signOutSubscription.unsubscribe()
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
