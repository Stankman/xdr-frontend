import { Component, Input, ChangeDetectionStrategy, inject } from '@angular/core';
import slugify from 'slugify';
import { Article } from 'src/app/modules/core/models/article/article.model';
import { LanguageService } from '../../../services/language.service';

@Component({
    selector: 'xdr-article-slide',
    templateUrl: './article-slide.component.html',
    styleUrls: ['./article-slide.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ArticleSlideComponent {
  @Input() public imageFirst = false;
  private _article: Article;
  public imageFailed = false;
  public readonly language = inject(LanguageService);

  public get article(): Article {
    return this._article;
  }

  @Input('article')
  public set article(value: Article) {
    this._article = value;
    this.imageFailed = false;
  }

  public get articleURL() : string {
    return `/article/${this.article.id}-${slugify(this.article.title, { lower: true })}`
  }
}
