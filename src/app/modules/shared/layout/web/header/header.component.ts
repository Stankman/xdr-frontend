import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignInDialogComponent } from '../signin-dialog/signin-dialog.component';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounceInDown, bounceOutUp } from 'ng-animate';
import { ThemeService } from '../../../services/theme.service';
import { Observable } from 'rxjs';

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

  public ref: DynamicDialogRef = new DynamicDialogRef;

  public mainMenuItems : MenuItem[] = [];

  public isDark : boolean = false;

  constructor(
    public dialogService : DialogService,
    public themeService : ThemeService
  ) { }

  ngOnInit() {
    this.isDark = this.themeService.getTheme();

    this.mainMenuItems = [
      {
        label: 'Stankman',
        visible: false
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
        routerLink: 'team'
      },
      {
        label: 'Hall Of Fame',
        routerLink: 'hall-of-fame'
      },
      {
        label: 'Store',
        routerLink: 'shop'
      }
    ];
  }

  show() {
    this.ref = this.dialogService.open(SignInDialogComponent, {
      dismissableMask: true,
      styleClass: 'login-dialog overflow-hidden max-w-30rem sm:w-30rem md:w-30rem sm:border-noround md:border-round',
      height: '80%'
    });
  }

  onThemeChange(event) {
    this.themeService.setTheme(event.checked);
  }
}
