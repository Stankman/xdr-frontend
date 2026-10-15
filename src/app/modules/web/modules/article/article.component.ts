import { Component, DestroyRef, ElementRef, Injector, OnInit, ViewChild, afterNextRender, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { Article } from 'src/app/modules/core/models/article/article.model';
import { LanguageService } from 'src/app/modules/shared/services/language.service';

@Component({
    selector: 'xdr-article',
    templateUrl: './article.component.html',
    styleUrls: ['./article.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ArticleComponent implements OnInit {
  
  public article : Article;

  public imageFailed = false;
  public readonly language = inject(LanguageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  @ViewChild('articlePage') private articlePage?: ElementRef<HTMLElement>;
  @ViewChild('articleTitle') private articleTitle?: ElementRef<HTMLElement>;

  constructor(
    private readonly route : ActivatedRoute
  ) {}
  
  ngOnInit(): void {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.article = data['article'];
      this.imageFailed = false;
      afterNextRender(() => {
        this.articlePage?.nativeElement.scrollIntoView({ block: 'start' });
        this.articleTitle?.nativeElement.focus({ preventScroll: true });
      }, { injector: this.injector });
    });
  }
}
