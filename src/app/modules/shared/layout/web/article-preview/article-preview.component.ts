import { Component, Input } from '@angular/core';
import { Article } from 'src/app/modules/core/models/article/article.model';

@Component({
  selector: 'xdr-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent {
  private _article: Article;

  public get article(): Article {
    return this._article;
  }
  
  @Input('article')
  public set article(value: Article) {
    this._article = value;
  }
}
