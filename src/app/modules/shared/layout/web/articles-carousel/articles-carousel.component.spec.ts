import { of, Subject, throwError } from 'rxjs';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';
import { ArticleService } from '../../../services/article.service';
import { ArticlesCarouselComponent } from './articles-carousel.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../shared.module';
import { LanguageService } from '../../../services/language.service';
import { Article } from 'src/app/modules/core/models/article/article.model';

describe('ArticlesCarouselComponent loading', () => {
  const create = (articles: ArticleService) => TestBed.runInInjectionContext(() => new ArticlesCarouselComponent(articles));

  it('starts with loading enabled before the first request', () => {
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['getPaginatedAvailableArticles']);
    expect(create(articles).loading).toBeTrue();
  });

  describe('Articles carousel controls', () => {
    beforeEach(async () => {
      const items = [1, 2].map(id => Object.assign(new Article(), { id, title: `News ${id}`, description: 'News', image: '' }));
      await TestBed.configureTestingModule({
        imports: [SharedModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
        providers: [
          { provide: ArticleService, useValue: { getPaginatedAvailableArticles: () => of(Object.assign(new ArticlePagination(), { items })) } },
          { provide: LanguageService, useValue: { getCurrentCulture: () => 'en-US' } }
        ]
      }).compileComponents();
    });

    it('really stops and restarts the PrimeNG timer, and pauses on manual navigation', fakeAsync(() => {
      const fixture = TestBed.createComponent(ArticlesCarouselComponent);
      fixture.componentInstance.paused = true;
      fixture.detectChanges();
      tick();
      const carousel = fixture.componentInstance.carousel!;
      expect(carousel.isPlaying()).toBeFalse();
      fixture.componentInstance.togglePause();
      fixture.detectChanges();
      tick();
      expect(carousel.isPlaying()).toBeTrue();
      fixture.componentInstance.togglePause();
      fixture.detectChanges();
      expect(carousel.isPlaying()).toBeFalse();
      fixture.componentInstance.togglePause();
      fixture.detectChanges();
      tick();
      fixture.componentInstance.next(new MouseEvent('click'));
      fixture.detectChanges();
      expect(fixture.componentInstance.paused).toBeTrue();
      expect(carousel.isPlaying()).toBeFalse();
      expect(fixture.componentInstance.slideIndex).toBe(1);
      fixture.componentInstance.previous(new MouseEvent('click'));
      expect(fixture.componentInstance.slideIndex).toBe(0);
      fixture.destroy();
    }));

    it('starts paused for reduced-motion preference', () => {
      spyOn(globalThis, 'matchMedia').and.returnValue({
        matches: true, media: '(prefers-reduced-motion: reduce)', onchange: null,
        addListener: () => {}, removeListener: () => {}, addEventListener: () => {},
        removeEventListener: () => {}, dispatchEvent: () => true,
      });
      const fixture = TestBed.createComponent(ArticlesCarouselComponent);
      expect(fixture.componentInstance.paused).toBeTrue();
    });

    it('uses the shared green finish for its error retry', () => {
      const fixture = TestBed.createComponent(ArticlesCarouselComponent);
      fixture.detectChanges();
      fixture.componentInstance.failed = true;
      fixture.detectChanges();
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.web-green-button');
      expect(button).not.toBeNull();
      expect(getComputedStyle(button).backgroundColor).toBe('rgb(0, 129, 62)');
      expect(getComputedStyle(button).borderRadius).toBe('12px');
      fixture.destroy();
    });
  });

  it('leaves loading on failure and permits a successful retry', () => {
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['getPaginatedAvailableArticles']);
    articles.getPaginatedAvailableArticles.and.returnValue(throwError(() => new Error('Unavailable')));
    const component = create(articles);
    component.ngOnInit();
    expect(component.loading).toBeFalse();
    expect(component.failed).toBeTrue();
    const result = new ArticlePagination();
    articles.getPaginatedAvailableArticles.and.returnValue(of(result));
    component.ngOnInit();
    expect(component.loading).toBeFalse();
    expect(component.failed).toBeFalse();
    expect(component.dataSource).toBe(result);
  });

  it('remains loading until the outstanding request completes', () => {
    const response = new Subject<ArticlePagination>();
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['getPaginatedAvailableArticles']);
    articles.getPaginatedAvailableArticles.and.returnValue(response);
    const component = create(articles);
    component.ngOnInit();
    expect(component.loading).toBeTrue();
    response.next(new ArticlePagination());
    response.complete();
    expect(component.loading).toBeFalse();
    expect(component.failed).toBeFalse();
  });

  it('clears failure while a retry is pending and unlocks an empty result', () => {
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['getPaginatedAvailableArticles']);
    articles.getPaginatedAvailableArticles.and.returnValue(throwError(() => new Error('Unavailable')));
    const component = create(articles);
    component.ngOnInit();
    const response = new Subject<ArticlePagination>();
    articles.getPaginatedAvailableArticles.and.returnValue(response);
    component.ngOnInit();
    expect(component.loading).toBeTrue();
    expect(component.failed).toBeFalse();
    response.next(Object.assign(new ArticlePagination(), { items: [] }));
    response.complete();
    expect(component.loading).toBeFalse();
    expect(component.dataSource.items).toEqual([]);
  });
});
