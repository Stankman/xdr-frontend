import { Component, OnInit } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RecentUsersComponent } from '../recent-users/recent-users.component';

@Component({
  selector: 'xdr-signin-dialog',
  templateUrl: './signin-dialog.component.html',
  styleUrls: ['./signin-dialog.component.css'],
  providers: [
    DialogService
  ]
})
export class SignInDialogComponent implements OnInit {

  public ref: DynamicDialogRef = new DynamicDialogRef;

  constructor(
    public dialogService : DialogService
  ) { }

  ngOnInit() {
  }

  show() {
    this.ref = this.dialogService.open(RecentUsersComponent, {
      dismissableMask: true,
      styleClass: 'login-dialog overflow-hidden',
      width: '50%'
    });
  }

}
