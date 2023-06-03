import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignInDialogComponent } from '../signin-dialog/signin-dialog.component';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounceInDown, bounceOutUp } from 'ng-animate';
import { ThemeService } from '../../../services/theme.service';
import { Observable, Subscription } from 'rxjs';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { Account } from 'src/app/modules/core/models/account/account.model';

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
  public isLogged : boolean = false;
  public toggle : boolean = false;

  constructor(
    private readonly dialogService : DialogService,
    private readonly themeService : ThemeService,
    private readonly accountService : AccountService,
    private readonly authService : AuthService,
    private readonly router : Router
  ) { }

    public toggleButton() {
      this.toggle = !this.toggle;
    }

  ngOnInit() {
    this.isDark = this.themeService.getTheme();
    this.account = this.accountService.account;

    this.accountService.accountObservable.subscribe({
      next: (account : Account) => {
        if(account) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }

        this.updateMenuItems();
      }
    });
  }

  private updateMenuItems() {
    this.mainMenuItems = [
      {
        label: this.account.active_avatar.username,
        routerLink: 'me',
        visible: this.isLogged
      },
      {
        label: 'Community',
        routerLink: 'community'
      },
      {
        label: 'News',
        routerLink: 'articles'
      },
      {
        label: 'Our Team',
        routerLink: 'team',
        visible: this.isLogged
      },
      {
        label: 'Hall Of Fame',
        routerLink: 'hall-of-fame'
      },
      {
        label: 'Store',
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

  onThemeChange(event) {
    this.themeService.setTheme(event.checked);
  }
}
