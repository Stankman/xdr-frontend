import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from 'src/app/modules/core/models/article/article.model';

@Component({
  selector: 'xdr-article-slide',
  templateUrl: './article-slide.component.html',
  styleUrls: ['./article-slide.component.scss']
})
export class ArticleSlideComponent {
  private _article: Article;

  constructor(
    private readonly router : Router
  ) {}

  public get article(): Article {
    return this._article;
  }

  @Input('article')
  public set article(value: Article) {
    this._article = value;
  }
}
