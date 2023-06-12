import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';

@Component({
  selector: 'xdr-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent {

  public dataSource : ArticlePagination;

  constructor(
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.dataSource = this.route.snapshot.data['articles'];
  }
}
