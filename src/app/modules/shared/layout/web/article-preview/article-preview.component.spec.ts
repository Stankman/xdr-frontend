import { CommonModule, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { Article } from 'src/app/modules/core/models/article/article.model';
import { ArticleComponent } from 'src/app/modules/web/modules/article/article.component';
import { LanguageService } from '../../../services/language.service';
import { ArticleSlideComponent } from '../article-slide/article-slide.component';
import { ArticlePreviewComponent } from './article-preview.component';

describe('Article surfaces rendering', () => {
  let culture: string;
  let route: BehaviorSubject<{ article: Article }>;
  const article = (id = 1) => Object.assign(new Article(), {
    id, title: `Hotel story ${id}`, description: 'News for everyone', image: '',
    content: '<h2>Heading</h2><p>Body <a href="javascript:alert(1)">link</a></p><script>alert(1)</script>',
  });

  beforeEach(async () => {
    registerLocaleData(localeEs);
    culture = 'en-US';
    route = new BehaviorSubject({ article: article() });
    await TestBed.configureTestingModule({
      declarations: [ArticlePreviewComponent, ArticleSlideComponent, ArticleComponent],
      imports: [CommonModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: LanguageService, useValue: { getCurrentCulture: () => culture } },
        { provide: ActivatedRoute, useValue: { data: route } }
      ]
    }).compileComponents();
  });

  for (const type of [ArticlePreviewComponent, ArticleSlideComponent]) {
    it(`renders ${type.name} without optional metadata, with a real readable link`, () => {
      const fixture = TestBed.createComponent<ArticlePreviewComponent | ArticleSlideComponent>(type);
      fixture.componentInstance.article = article();
      fixture.detectChanges();
      const link: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
      expect(link.getAttribute('href')).toBe('/article/1-hotel-story-1');
      expect(fixture.nativeElement.textContent).toContain('Hotel story 1');
      expect(fixture.nativeElement.textContent).toContain('News for everyone');
      expect(fixture.nativeElement.querySelector('img')).toBeNull();
    });

    it(`updates ${type.name} dates, locale and failed image state on a new input`, () => {
      const fixture = TestBed.createComponent<ArticlePreviewComponent | ArticleSlideComponent>(type);
      fixture.componentInstance.article = Object.assign(article(), { createdAt: '2026-01-10T12:00:00Z', image: '/missing.png' });
      fixture.detectChanges();
      expect(fixture.nativeElement.textContent).toContain('Jan 10, 2026');
      fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
      fixture.detectChanges();
      expect(fixture.componentInstance.imageFailed).toBeTrue();
      culture = 'es-ES';
      fixture.componentInstance.article = Object.assign(article(2), { createdAt: '2026-02-12T12:00:00Z' });
      fixture.detectChanges();
      expect(fixture.componentInstance.imageFailed).toBeFalse();
      expect(fixture.nativeElement.textContent).toContain('12 feb 2026');
      expect(fixture.nativeElement.textContent).not.toContain('Jan 10, 2026');
    });
  }

  it('shares the green slide finish but keeps image-led reading as a text link', () => {
    const fixture = TestBed.createComponent(ArticleSlideComponent);
    fixture.componentInstance.article = article();
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.slide-read');
    expect(link.classList.contains('web-green-button')).toBeTrue();
    expect(getComputedStyle(link).backgroundColor).toBe('rgb(0, 129, 62)');
    expect(getComputedStyle(link).borderColor).toBe('rgb(142, 218, 85)');
    expect(getComputedStyle(link).borderRadius).toBe('12px');
    expect(getComputedStyle(link).boxShadow).toBe('rgba(0, 0, 0, 0.267) 0px 3px 0px 0px');
    fixture.componentInstance.imageFirst = true;
    fixture.detectChanges();
    expect(link.classList.contains('web-green-button')).toBeFalse();
    expect(getComputedStyle(link).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(link).boxShadow).toBe('none');
    expect(getComputedStyle(link).borderWidth).toBe('0px');
    expect(link.getAttribute('href')).toBe('/article/1-hotel-story-1');
  });

  it('renders semantic detail content, sanitized HTML, back navigation and route updates', () => {
    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Hotel story 1');
    expect(fixture.nativeElement.querySelector('.back-news').getAttribute('href')).toBe('/articles');
    const body: HTMLElement = fixture.nativeElement.querySelector('.xdr-article-content');
    expect(body.querySelector('h2')?.textContent).toBe('Heading');
    expect(body.querySelector('script')).toBeNull();
    expect(body.querySelector('a')?.getAttribute('href')).not.toBe('javascript:alert(1)');
    fixture.componentInstance.imageFailed = true;
    route.next({ article: article(2) });
    fixture.detectChanges();
    expect(fixture.componentInstance.imageFailed).toBeFalse();
    expect(fixture.nativeElement.querySelector('h1').textContent).toBe('Hotel story 2');
  });

  it('contains long titles and wide rich content within a narrow reading layout', () => {
    const fixture = TestBed.createComponent(ArticleComponent);
    fixture.nativeElement.style.width = '320px';
    const longText = 'LongUnbrokenText'.repeat(40);
    route.next({ article: Object.assign(article(), {
      title: longText,
      description: longText,
      content: `<h2>Heading</h2><p>${longText}</p><ul><li>List item</li></ul><blockquote>A quote</blockquote><pre>${longText}</pre><table><tr><td>${longText}</td><td>Second column</td></tr></table>`
    }) });
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const body = root.querySelector<HTMLElement>('.article-body')!;
    expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth);
    expect(body.scrollWidth).toBeLessThanOrEqual(body.clientWidth);
    expect(getComputedStyle(body.querySelector('ul')!).listStyleType).toBe('disc');
    expect(getComputedStyle(body.querySelector('pre')!).overflowX).toBe('auto');
    expect(getComputedStyle(body.querySelector('table')!).overflowX).toBe('auto');
  });
});
