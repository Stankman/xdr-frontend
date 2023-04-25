import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { bounceInDown, fadeIn } from 'ng-animate';

@Component({
  selector: 'xdr-web',
  templateUrl: './web.component.html',
  styleUrls: ['./web.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {
      params: {
        timing: 1.5
      }
    }))])
  ]
})
export class WebComponent implements OnInit {

  public htmlTranslation = "<p><b>Create your Avatar.</b><br /><b>Today.</b><br />Welcome to the biggest retro community on the net. Join now and have fun with 1 million players.<br /><br />Begin you journey.</p>";

  constructor() { }

  ngOnInit() {
  }
}
