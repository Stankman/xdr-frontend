import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { SignInDialogComponent } from '../signin-dialog/signin-dialog.component';
import { trigger, transition, useAnimation } from '@angular/animations';
import { bounceInDown } from 'ng-animate';

@Component({
  selector: 'xdr-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [
    DialogService
  ],
  animations: [
    trigger('bounceInDown', [transition('* => *', useAnimation(bounceInDown, {
      params: {
        timing: 2
      }
    }))])
  ]
})
export class HeaderComponent implements OnInit {

  public ref: DynamicDialogRef = new DynamicDialogRef;

  public mainMenuItems : MenuItem[] = [];

  constructor(
    public dialogService : DialogService
  ) { }

  ngOnInit() {
    this.show();

    this.mainMenuItems = [
      {
        label: 'Play now!',
        styleClass: 'lg:hidden'
      },
      {
        label: 'Home'
      },
      {
        label: 'Community'
      },
      {
        label: 'Our Team'
      },
      {
        label: 'News'
      },
      {
        label: 'Store'
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
}
