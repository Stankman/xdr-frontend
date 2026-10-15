import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule,
  convertToParamMap,
  provideRouter
} from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';
import { ArticleService } from 'src/app/modules/shared/services/article.service';
import { LanguageService } from 'src/app/modules/shared/services/language.service';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { ArticlesComponent } from './articles.component';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

const searchModules = [InputGroupModule, InputGroupAddonModule, IconFieldModule, InputIconModule];
import { Article } from 'src/app/modules/core/models/article/article.model';

describe('Articles listing', () => {
  let params: BehaviorSubject<ReturnType<typeof convertToParamMap>>;
  let service: jasmine.SpyObj<ArticleService>;
  let router: jasmine.SpyObj<Router>;
  let component: ArticlesComponent;

  const result = (page = 1, total = 25) =>
    Object.assign(new ArticlePagination(), {
      items: [],
      meta: {
        currentPage: page,
        itemCount: 0,
        itemsPerPage: 10,
        totalItems: total,
        totalPages: Math.ceil(total / 10)
      }
    });

  beforeEach(() => {
    params = new BehaviorSubject(convertToParamMap({}));
    service = jasmine.createSpyObj<ArticleService>('ArticleService', [
      'getPaginatedAvailableArticles'
    ]);
    service.getPaginatedAvailableArticles.and.returnValue(of(result()));
    router = jasmine.createSpyObj<Router>('Router', ['navigate']);
    router.navigate.and.returnValue(Promise.resolve(true));
    TestBed.configureTestingModule({
      providers: [
        { provide: ActivatedRoute, useValue: { queryParamMap: params } },
        { provide: Router, useValue: router },
        { provide: ArticleService, useValue: service }
      ]
    });
    component = TestBed.runInInjectionContext(
      () =>
        new ArticlesComponent(TestBed.inject(ActivatedRoute), router, service)
    );
  });

  afterEach(() => TestBed.resetTestingModule());

  it('loads 10 results and restores search/page on URL changes', () => {
    component.ngOnInit();
    expect(service.getPaginatedAvailableArticles).toHaveBeenCalledWith(
      1,
      10,
      ''
    );
    params.next(convertToParamMap({ q: 'hotel', page: '2' }));
    expect(component.search).toBe('hotel');
    expect(component.page).toBe(2);
    expect(service.getPaginatedAvailableArticles).toHaveBeenCalledWith(
      2,
      10,
      'hotel'
    );
    params.next(convertToParamMap({}));
    expect(component.search).toBe('');
    expect(component.page).toBe(1);
  });

  it('submits trimmed search on page one, changes pages, and clears URL state', () => {
    component.ngOnInit();
    component.search = '  friends  ';
    component.submitSearch();
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({ queryParams: { page: null, q: 'friends' } })
    );
    params.next(convertToParamMap({ q: 'friends' }));
    component.changePage(3);
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({ queryParams: { page: 3, q: 'friends' } })
    );
    component.clearSearch();
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({ queryParams: { page: null, q: null } })
    );
  });

  it('rejects oversized or repeated searches without sending an API request', () => {
    params.next(convertToParamMap({ q: 'x'.repeat(81) }));
    component.ngOnInit();
    expect(component.invalidSearch).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(service.getPaginatedAvailableArticles).not.toHaveBeenCalled();
    params.next(convertToParamMap({ q: ['one', 'two'] }));
    expect(service.getPaginatedAvailableArticles).not.toHaveBeenCalled();
  });

  it('normalizes malformed pages and whitespace searches with URL replacement', () => {
    params.next(convertToParamMap({ page: 'bad', q: ' hotel ' }));
    component.ngOnInit();
    expect(service.getPaginatedAvailableArticles).not.toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { page: null, q: 'hotel' },
        replaceUrl: true
      })
    );
  });

  it('replaces pages beyond the final result page', () => {
    params.next(convertToParamMap({ page: '9' }));
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(
      [],
      jasmine.objectContaining({
        queryParams: { page: 3, q: null },
        replaceUrl: true
      })
    );
  });

  it('displays failure and retries the current query, cancelling retry on navigation', () => {
    service.getPaginatedAvailableArticles.and.returnValue(
      throwError(() => new Error('Offline'))
    );
    component.ngOnInit();
    expect(component.failed).toBeTrue();
    expect(component.loading).toBeFalse();
    const pending = new Subject<ArticlePagination>();
    service.getPaginatedAvailableArticles.and.returnValue(pending);
    component.retry();
    expect(component.failed).toBeFalse();
    expect(component.loading).toBeTrue();
    service.getPaginatedAvailableArticles.and.returnValue(of(result(2)));
    params.next(convertToParamMap({ page: '2' }));
    expect(pending.observed).toBeFalse();
    expect(component.dataSource?.meta.currentPage).toBe(2);
  });

  it('cancels stale responses and tears down on destruction', () => {
    const first = new Subject<ArticlePagination>();
    const second = new Subject<ArticlePagination>();
    service.getPaginatedAvailableArticles.and.returnValues(first, second);
    component.ngOnInit();
    params.next(convertToParamMap({ q: 'new' }));
    expect(first.observed).toBeFalse();
    expect(component.loading).toBeTrue();
    second.next(result());
    second.complete();
    expect(component.loading).toBeFalse();
    TestBed.resetTestingModule();
    const count = service.getPaginatedAvailableArticles.calls.count();
    params.next(convertToParamMap({ q: 'later' }));
    expect(service.getPaginatedAvailableArticles.calls.count()).toBe(count);
  });

  it('debounces typed searches into replaced URL updates and lets submit/clear cancel them', fakeAsync(() => {
    component.ngOnInit();
    router.navigate.calls.reset();
    component.search = 'ha';
    component.onSearchInput();
    tick(200);
    component.search = '  hab ';
    component.onSearchInput();
    tick(component.searchDebounceMs - 1);
    expect(router.navigate).not.toHaveBeenCalled();
    tick(1);
    expect(router.navigate).toHaveBeenCalledOnceWith(
      [],
      jasmine.objectContaining({ queryParams: { page: null, q: 'hab' }, replaceUrl: true })
    );
    params.next(convertToParamMap({ q: 'hab' }));
    expect(component.search).toBe('  hab ');

    router.navigate.calls.reset();
    component.search = 'hab ';
    component.onSearchInput();
    tick(component.searchDebounceMs);
    expect(router.navigate).not.toHaveBeenCalled();

    component.search = 'habbo';
    component.onSearchInput();
    component.submitSearch();
    expect(router.navigate).toHaveBeenCalledOnceWith(
      [],
      jasmine.objectContaining({ queryParams: { page: null, q: 'habbo' }, replaceUrl: false })
    );
    tick(component.searchDebounceMs);
    expect(router.navigate).toHaveBeenCalledTimes(1);

    component.search = 'x'.repeat(81);
    component.onSearchInput();
    tick(component.searchDebounceMs);
    expect(component.invalidSearch).toBeTrue();
    expect(router.navigate).toHaveBeenCalledTimes(1);
  }));

  it('recovers from an invalid draft and provides bounded visible page numbers', () => {
    component.ngOnInit();
    component.search = 'x'.repeat(81);
    component.submitSearch();
    expect(component.invalidSearch).toBeTrue();
    component.search = '';
    component.submitSearch();
    expect(component.invalidSearch).toBeFalse();
    expect(component.pageNumbers).toEqual([1, 2, 3]);
    component.dataSource = result(7, 70);
    component.page = 7;
    expect(component.pageNumbers).toEqual([5, 6, 7]);
    component.dataSource = result(1, 15);
    component.page = 1;
    expect(component.pageNumbers).toEqual([1, 2]);
  });
});

describe('Articles listing rendering', () => {
  let fixture: ComponentFixture<ArticlesComponent>;
  let response: Subject<ArticlePagination>;

  beforeEach(async () => {
    response = new Subject<ArticlePagination>();
    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      imports: [
        SharedModule,
        FormsModule,
        ...searchModules,
        RouterModule.forRoot([]),
        TranslateModule.forRoot()
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({ q: 'hotel' })) }
        },
        {
          provide: ArticleService,
          useValue: { getPaginatedAvailableArticles: () => response }
        },
        {
          provide: LanguageService,
          useValue: { getCurrentCulture: () => 'en-US' }
        }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(ArticlesComponent);
    fixture.detectChanges();
  });

  it('renders loading, no matches, and an explicitly labeled form', () => {
    expect(
      fixture.nativeElement.querySelector('.article-skeleton')
    ).not.toBeNull();
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(
      'article-search'
    );
    response.next(
      Object.assign(new ArticlePagination(), {
        items: [],
        meta: {
          totalItems: 0,
          totalPages: 0,
          currentPage: 1,
          itemsPerPage: 10,
          itemCount: 0
        }
      })
    );
    response.complete();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('ARTICLES.NO_MATCHES');
    expect(fixture.nativeElement.querySelector('.article-skeleton')).toBeNull();
  });

  it('renders an error and retry rather than an empty success state', () => {
    response.error(new Error('Offline'));
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role="alert"]')
    ).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('COMMON.RETRY');
    expect(fixture.nativeElement.textContent).not.toContain(
      'ARTICLES.NO_MATCHES'
    );
    expect(fixture.nativeElement.querySelector('.news-feedback button.web-green-button')).not.toBeNull();
  });

  it('shares the green search finish while keeping its joined left corners', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.search-submit');
    const style = getComputedStyle(button);
    expect(button.classList.contains('web-green-button')).toBeTrue();
    expect(style.backgroundColor).toBe('rgb(0, 129, 62)');
    expect(style.borderColor).toBe('rgb(142, 218, 85)');
    expect(style.borderTopLeftRadius).toBe('0px');
    expect(style.borderBottomLeftRadius).toBe('0px');
    expect(style.borderTopRightRadius).toBe('12px');
    expect(style.borderBottomRightRadius).toBe('12px');
    expect(style.boxShadow).toBe('rgba(0, 0, 0, 0.267) 0px 3px 0px 0px');
  });
});

describe('Articles listing router integration', () => {
  beforeEach(async () => {
    const items = Array.from({ length: 25 }, (_, index) =>
      Object.assign(new Article(), {
        id: index + 1,
        title: `Fixture ${index + 1}`,
        description: 'Room news',
        image: ''
      })
    );
    await TestBed.configureTestingModule({
      declarations: [ArticlesComponent],
      imports: [SharedModule, FormsModule, ...searchModules, TranslateModule.forRoot()],
      providers: [
        provideRouter([{ path: 'articles', component: ArticlesComponent }]),
        {
          provide: LanguageService,
          useValue: { getCurrentCulture: () => 'en-US' }
        },
        {
          provide: ArticleService,
          useValue: {
            getPaginatedAvailableArticles: (
              page: number,
              limit: number,
              search: string
            ) => {
              const matches = items.filter((item) =>
                item.title.includes(search)
              );
              const pageItems = matches.slice((page - 1) * limit, page * limit);
              return of(
                Object.assign(new ArticlePagination(), {
                  items: pageItems,
                  meta: {
                    currentPage: page,
                    totalItems: matches.length,
                    totalPages: Math.ceil(matches.length / limit),
                    itemsPerPage: limit,
                    itemCount: pageItems.length
                  }
                })
              );
            }
          }
        }
      ]
    }).compileComponents();
  });

  it('renders exactly 10/10/5 cards across real URL navigations and restores a deep link', async () => {
    const harness = await RouterTestingHarness.create('/articles');
    const router = TestBed.inject(Router);
    const cards = () =>
      harness.routeNativeElement!.querySelectorAll('.article-card');
    expect(cards().length).toBe(10);
    const next = () =>
      harness.routeNativeElement!.querySelector<HTMLButtonElement>(
        '[aria-label="ARTICLES.PAGINATION.NEXT"]'
      )!;
    next().click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe('/articles?page=2');
    expect(document.activeElement?.id).toBe('news-title');
    expect(cards().length).toBe(10);
    expect(cards()[0].textContent).toContain('Fixture 11');
    next().click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(router.url).toBe('/articles?page=3');
    expect(cards().length).toBe(5);
    expect(next().disabled).toBeTrue();
    await harness.navigateByUrl('/articles?page=2', ArticlesComponent);
    expect(cards()[0].textContent).toContain('Fixture 11');
    expect(cards().length).toBe(10);
  });

  it('submits a real form, resets pagination, and clears search in the URL', async () => {
    const harness = await RouterTestingHarness.create('/articles?page=3');
    const root = harness.routeNativeElement!;
    const input = root.querySelector<HTMLInputElement>('input')!;
    input.value = 'Fixture 25';
    input.dispatchEvent(new Event('input'));
    harness.detectChanges();
    root
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/articles?q=Fixture%2025');
    expect(root.querySelectorAll('.article-card').length).toBe(1);
    expect(root.querySelector('.article-card')!.textContent).toContain(
      'Fixture 25'
    );
    root.querySelector<HTMLButtonElement>('.clear-search')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/articles');
    expect(root.querySelectorAll('.article-card').length).toBe(10);
  });

  it('searches automatically while typing inside an aligned input group', async () => {
    const harness = await RouterTestingHarness.create('/articles');
    const root = harness.routeNativeElement!;
    expect(root.querySelector('p-inputgroup input#article-search')).not.toBeNull();
    expect(root.querySelector('p-inputgroup button[type="submit"]')).not.toBeNull();
    expect(root.querySelector('.clear-search')).toBeNull();
    const input = root.querySelector<HTMLInputElement>('#article-search')!;
    input.value = 'Fixture 7';
    input.dispatchEvent(new Event('input'));
    harness.detectChanges();
    expect(root.querySelector('.clear-search')).not.toBeNull();
    await new Promise(resolve => setTimeout(resolve, 450));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/articles?q=Fixture%207');
    expect(root.querySelectorAll('.article-card').length).toBe(1);
  });
});
