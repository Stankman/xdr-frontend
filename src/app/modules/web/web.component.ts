import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'xdr-web',
    templateUrl: './web.component.html',
    styleUrls: ['./web.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class WebComponent implements OnInit {
  
  constructor(
    public router : Router
  ) { }

  ngOnInit() {
  }

  public isRegistration() : boolean {
    return this.router.url.startsWith('/registration');
  }
}
