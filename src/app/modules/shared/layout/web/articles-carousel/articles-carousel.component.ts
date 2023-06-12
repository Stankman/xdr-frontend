import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../../../services/article.service';
import { Subscription } from 'rxjs';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';

@Component({
  selector: 'xdr-articles-carousel',
  templateUrl: './articles-carousel.component.html',
  styleUrls: ['./articles-carousel.component.scss']
})
export class ArticlesCarouselComponent implements OnInit{

  public loading : boolean;

  public dataSource : ArticlePagination;

  constructor(
    private articleService : ArticleService
  ) {

  }

  ngOnInit(): void {
      this.loading = true;

      const articleSubscription : Subscription = this.articleService.getPaginatedAvailableArticles().subscribe({
        next: (res : ArticlePagination) => {
          this.dataSource = res;
        },
        complete: () => {
          this.loading = false;
          articleSubscription.unsubscribe();
        }
      });
  }
}
