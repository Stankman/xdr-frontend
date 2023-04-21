import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { bounce, bounceInDown, fadeIn } from 'ng-animate';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SignInDialogComponent } from '../shared/layout/web/signin-dialog/signin-dialog.component';

@Component({
  selector: 'app-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.scss'],
  providers: [
    DialogService
  ],
  animations: [
    trigger('bounceInDown', [transition('* => *', useAnimation(bounceInDown, {
      params: {
        timing: 2
      }
    }))]),
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {
      params: {
        timing: 1.5
      }
    }))])
  ]
})
export class WebComponent implements OnInit {

  public ref: DynamicDialogRef = new DynamicDialogRef;

  public mainMenuItems : MenuItem[] = [];

  public htmlTranslation = "<p><b>Create your Avatar.</b><br /><b>Today.</b><br />Welcome to the biggest retro community on the net. Join now and have fun with 1 million players.<br /><br />Begin you journey.</p>";

  constructor(
    public dialogService : DialogService
  ) { }

  ngOnInit() {
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
      header: 'Sign In',
      dismissableMask: true,
      width: '50%'
    });
  }

}
