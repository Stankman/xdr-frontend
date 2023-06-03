import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Account } from 'src/app/modules/core/models/account/account.model';
import { group, query, style, transition, trigger, useAnimation } from '@angular/animations';
import { fadeIn, zoomIn } from 'ng-animate';
import { LookService } from '../../../services/look.service';
import { LookSizes } from 'src/app/modules/core/models/look/look-sizes.model';

@Component({
  selector: 'xdr-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  animations: [
    trigger('hero', [
      transition(
        ':enter',
        [
          group([
            query('#hero-title', style({opacity: 0})),
            query('#hero-avatar', style({opacity: 0}))
          ]),
          group([
            query('#hero-title', useAnimation(fadeIn)),
            query('#hero-avatar', [
              useAnimation(zoomIn, {params: {timing: 0.75}})
            ])
          ])
        ]
      )
    ])
  ]
})
export class SummaryComponent implements OnInit {
  public account : Account;
  
  constructor(
    private readonly accountService : AccountService,
    private readonly lookService : LookService,
  ) {}

  ngOnInit(): void {
    this.account = this.accountService.account;
  }

    /**
   * Returns a full path image for the look
   *
   * @param look
   * @param online
   * @return string
  */
  public get look() {
    return this.lookService.get({
      look: this.account.active_avatar.look,
      size: LookSizes.LARGE 
    });
  }
}
