import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import slugify from 'slugify';
import { Article } from 'src/app/modules/core/models/article/article.model';

@Component({
  selector: 'xdr-article-slide',
  templateUrl: './article-slide.component.html',
  styleUrls: ['./article-slide.component.scss']
})
export class ArticleSlideComponent implements OnInit {
  private _article: Article;
  public articleDate: Date;

  constructor(
    private readonly router : Router
  ) {}

  ngOnInit(): void {
    this.articleDate = new Date(this.article.createdAt);
  }

  public get article(): Article {
    return this._article;
  }

  @Input('article')
  public set article(value: Article) {
    this._article = value;
  }

  public get articleURL() : string {
    return `/article/${this.article.id}-${slugify(this.article.title, { lower: true })}`
  }
}
