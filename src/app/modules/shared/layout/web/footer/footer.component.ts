import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xdr-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public countries : string[] = []

  public selectedCountry : string = 'es';

  constructor() { }

  ngOnInit() {
    this.countries = [
      'en', 'es'
    ]
  }

}
