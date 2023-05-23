import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Account } from 'src/app/modules/core/models/account/account.model';
import { AccountService } from 'src/app/modules/shared/services/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public account : Account;

  constructor(
    private readonly accountService : AccountService
  ) { }

  ngOnInit() {
    this.accountService.accountObservable.subscribe({
      next: (account : Account) => {
        this.account = account;
      }
    })
  }
}
