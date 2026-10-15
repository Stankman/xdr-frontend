import { Component, ChangeDetectionStrategy, DestroyRef, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subject, catchError, combineLatest, finalize, startWith, switchMap, tap, timer } from 'rxjs';
import { ArticlePagination } from 'src/app/modules/core/models/article/article-pagination.model';
import { ArticleService } from 'src/app/modules/shared/services/article.service';

@Component({
    selector: 'xdr-articles',
    templateUrl: './articles.component.html',
    styleUrls: ['./articles.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ArticlesComponent implements OnInit {

  public dataSource: ArticlePagination | undefined;
  public readonly pageSize = 10;
  public readonly searchDebounceMs = 400;
  public search = '';
  public appliedSearch = '';
  public page = 1;
  public loading = true;
  public failed = false;
  public invalidSearch = false;
  private readonly destroyRef = inject(DestroyRef);
  private readonly retries = new Subject<void>();
  // Emits true for each keystroke and false to cancel a pending debounced search.
  private readonly typedSearches = new Subject<boolean>();
  private focusResults = false;
  @ViewChild('newsTitle') private newsTitle?: ElementRef<HTMLElement>;
  @ViewChild('searchInput') private searchInput?: ElementRef<HTMLInputElement>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly articles: ArticleService
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.queryParamMap, this.retries.pipe(startWith(undefined))]).pipe(
      switchMap(([params]) => {
        const rawSearch = params.get('q') ?? '';
        this.appliedSearch = rawSearch.trim();
        if (this.search.trim() !== this.appliedSearch) this.search = this.appliedSearch;
        this.failed = false;
        this.invalidSearch = rawSearch.length > 80 || params.getAll('q').length > 1;
        if (this.invalidSearch) {
          this.loading = false;
          return EMPTY;
        }
        const rawPage = params.get('page');
        const page = rawPage === null ? 1 : Number(rawPage);
        if (!Number.isSafeInteger(page) || page < 1 || page > 100000 ||
            params.getAll('page').length > 1 || (rawPage !== null && !/^[1-9]\d*$/.test(rawPage)) ||
            rawSearch !== this.appliedSearch) {
          this.loading = false;
          this.navigate(1, this.appliedSearch, true);
          return EMPTY;
        }
        this.page = page;
        return this.load();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();

    this.typedSearches.pipe(
      switchMap(pending => pending ? timer(this.searchDebounceMs) : EMPTY),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.applyTypedSearch());
  }

  public onSearchInput(): void {
    this.typedSearches.next(true);
  }

  public submitSearch(): void {
    this.typedSearches.next(false);
    if (this.search.length > 80) {
      this.invalidSearch = true;
      return;
    }
    const search = this.search.trim();
    const wasInvalid = this.invalidSearch;
    this.invalidSearch = false;
    if (search === this.appliedSearch && this.page === 1 && !wasInvalid) {
      if (this.failed) this.retry();
      return;
    }
    this.navigate(1, search);
  }

  public clearSearch(): void {
    this.typedSearches.next(false);
    this.search = '';
    this.invalidSearch = false;
    this.navigate(1, '');
    this.searchInput?.nativeElement.focus();
  }

  private applyTypedSearch(): void {
    if (this.search.length > 80) {
      this.invalidSearch = true;
      return;
    }
    const search = this.search.trim();
    const wasInvalid = this.invalidSearch;
    this.invalidSearch = false;
    if (search === this.appliedSearch && !wasInvalid) return;
    this.navigate(1, search, true);
  }

  public get pageNumbers(): number[] {
    const total = this.dataSource?.meta.totalPages ?? 0;
    const start = Math.max(1, Math.min(this.page - 1, total - 2));
    return Array.from({ length: Math.min(3, total) }, (_, index) => start + index);
  }

  public changePage(page: number): void {
    if (this.loading || page === this.page) return;
    this.focusResults = true;
    this.navigate(page, this.appliedSearch);
  }

  public retry(): void {
    if (this.loading || this.invalidSearch) return;
    this.retries.next();
  }

  private load() {
    this.loading = true;
    this.failed = false;
    return this.articles.getPaginatedAvailableArticles(this.page, this.pageSize, this.appliedSearch).pipe(
      tap(result => {
        const lastPage = Math.max(1, result.meta.totalPages);
        if (this.page > lastPage) {
          this.navigate(lastPage, this.appliedSearch, true);
        } else {
          this.dataSource = result;
          if (this.focusResults) {
            this.focusResults = false;
            this.newsTitle?.nativeElement.focus();
          }
        }
      }),
      catchError(() => {
        this.failed = true;
        return EMPTY;
      }),
      finalize(() => this.loading = false)
    );
  }

  private navigate(page: number, search: string, replaceUrl = false): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page > 1 ? page : null, q: search || null },
      queryParamsHandling: 'merge',
      replaceUrl
    });
  }
}
