import { Component, Input, OnInit, ChangeDetectionStrategy, DestroyRef, Injector, ViewChild, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Carousel } from 'primeng/carousel';
import { ArticleService } from '../../../services/article.service';
import { finalize } from 'rxjs';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';

@Component({
    selector: 'xdr-articles-carousel',
    templateUrl: './articles-carousel.component.html',
    styleUrls: ['./articles-carousel.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ArticlesCarouselComponent implements OnInit{

  @Input() public imageFirst = false;

  public loading = true;

  public dataSource : ArticlePagination;
  public failed = false;
  public paused = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  public slideIndex = 0;
  @ViewChild(Carousel) public carousel?: Carousel;
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private articleService : ArticleService
  ) {

  }

  ngOnInit(): void {
      this.loading = true;

      this.failed = false;
      this.articleService.getPaginatedAvailableArticles().pipe(
        finalize(() => this.loading = false),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (res : ArticlePagination) => {
          this.dataSource = res;
          this.slideIndex = 0;
        },
        error: () => this.failed = true
      });
  }

  public togglePause(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.carousel?.stopAutoplay();
    } else {
      // PrimeNG reads its interval input when starting the timer.
      afterNextRender(() => {
        if (!this.paused) this.carousel?.startAutoplay();
      }, { injector: this.injector });
    }
  }

  public previous(event: MouseEvent): void {
    this.pause();
    this.carousel?.navBackward(event);
  }

  public next(event: MouseEvent): void {
    this.pause();
    this.carousel?.navForward(event);
  }

  public pause(): void {
    this.paused = true;
    this.carousel?.stopAutoplay();
  }
}
