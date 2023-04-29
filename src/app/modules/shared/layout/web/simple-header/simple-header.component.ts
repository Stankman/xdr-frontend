import { trigger, transition, useAnimation } from '@angular/animations';
import { Component } from '@angular/core';
import { bounceInDown, bounceOutUp } from 'ng-animate';

@Component({
  selector: 'xdr-simple-header',
  templateUrl: './simple-header.component.html',
  styleUrls: ['./simple-header.component.scss'],
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
export class SimpleHeaderComponent {

}
