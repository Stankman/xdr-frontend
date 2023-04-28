import { Component } from '@angular/core';

@Component({
  selector: 'xdr-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {

  public articles : any[] = [0,1,2,3,4,5];

  ngOnInit(): void {
      
  }
}
