import { Component, Input, OnInit } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { Rank } from 'src/app/modules/core/models/rank/rank.model';

@Component({
  selector: 'xdr-rank-card',
  templateUrl: './rank-card.component.html',
  styleUrls: ['./rank-card.component.scss']
})
export class RankCardComponent implements OnInit {
  private _rank: Rank = new Rank;

  @Input('rank')
  public set rank(value: Rank) {
    this._rank = value;
  }

  constructor() { }

  ngOnInit(): void {
    this.rank.avatars = [new Avatar, new Avatar, new Avatar]
  }

  public get rank(): Rank {
    return this._rank;
  }
}