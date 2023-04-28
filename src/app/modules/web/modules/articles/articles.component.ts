import { Component } from '@angular/core';

@Component({
  selector: 'xdr-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {

  public articles : any[] = [];

  ngOnInit(): void {
      
  }
}
