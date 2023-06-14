import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/modules/core/models/article/article.model';

@Component({
  selector: 'xdr-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  
  public article : Article;

  public text;

  constructor(
    private readonly route : ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.article = this.route.snapshot.data['article'];
  }
}
