import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { fadeIn } from 'ng-animate';

@Component({
  selector: 'xdr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn, {
      params: {
        timing: 1.5
      }
    }))])
  ]
})
export class LoginComponent implements OnInit {
  
  constructor() {}

  ngOnInit(): void {
  }
}
