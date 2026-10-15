import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Avatar } from 'src/app/modules/core/models/avatar/avatar.model';
import { LookGestures } from 'src/app/modules/core/models/look/look-gestures.model';
import { LookSizes } from 'src/app/modules/core/models/look/look-sizes.model';
import { LookService } from '../../../services/look.service';
import { LanguageService } from '../../../services/language.service';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'xdr-rank-member',
    templateUrl: './rank-member.component.html',
    styleUrls: ['./rank-member.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RankMemberComponent implements OnInit {
  private _member: Avatar = new Avatar;

  @Input('member')
  public set member(value: Avatar) {
    this._member = value;
  }

  constructor(
    private lookService: LookService
  ) { }

  ngOnInit(): void {
  }

  public get figure() : string {
    return this.lookService.get({
      look: this.member.look,
      size: LookSizes.DEFAULT,
      gesture: LookGestures.SMILE
    });
  }

  public get status() : boolean {
    return this.member.online === "1";
  }

  public get member(): Avatar {
    return this._member;
  }
}
