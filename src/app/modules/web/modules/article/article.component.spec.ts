import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { ArticleComponent } from './article.component';
import { ArticleResolver } from './resolvers/article.resolver';
import { Article } from 'src/app/modules/core/models/article/article.model';
import { ArticleService } from 'src/app/modules/shared/services/article.service';
import { LanguageService } from 'src/app/modules/shared/services/language.service';

describe('Article route updates', () => {
  it('updates article data when the same component receives a new route', () => {
    const first = Object.assign(new Article(), { id: 1, title: 'First' });
    const second = Object.assign(new Article(), { id: 2, title: 'Second' });
    const data = new BehaviorSubject({ article: first });
    TestBed.configureTestingModule({ providers: [
      { provide: ActivatedRoute, useValue: { data: data.asObservable() } },
      { provide: LanguageService, useValue: { getCurrentCulture: () => 'en-US' } }
    ] });
    const component = TestBed.runInInjectionContext(() => new ArticleComponent(TestBed.inject(ActivatedRoute)));
    component.ngOnInit();
    expect(component.article).toBe(first);
    data.next({ article: second });
    expect(component.article).toBe(second);
    TestBed.resetTestingModule();
    data.next({ article: first });
    expect(component.article).toBe(second);
  });

  it('cancels failed resolution and navigates to the existing not-found route', () => {
    const articles = jasmine.createSpyObj<ArticleService>('ArticleService', ['getArticle']);
    articles.getArticle.and.returnValue(throwError(() => new Error('Missing article')));
    const router = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);
    const route = new ActivatedRouteSnapshot();
    route.params = { slug: '12-title' };
    let emitted = false;
    let completed = false;
    new ArticleResolver(articles, router).resolve(route).subscribe({
      next: () => emitted = true,
      complete: () => completed = true
    });
    expect(articles.getArticle).toHaveBeenCalledWith(12);
    expect(emitted).toBeFalse();
    expect(completed).toBeTrue();
    expect(router.navigateByUrl).toHaveBeenCalledOnceWith('/not-found');
  });
});
