import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule, TablePageEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AcpDataState, AcpStateComponent } from './acp-state.component';
import { AcpDemoService } from '../acp-demo.service';

export interface AcpTableRow {
  id: string;
  cells: readonly string[];
  link: string[];
}

@Component({
  selector: 'xdr-acp-table',
  imports: [RouterModule, TranslateModule, TableModule, InputTextModule, ButtonModule, AcpStateComponent],
  template: `
    <section class="acp-panel" [attr.aria-label]="heading | translate" [attr.aria-busy]="effectiveState === 'loading'">
      <div class="acp-panel-heading"><h2>{{ heading | translate }}</h2></div>
      @if (searchable) {
        <form class="acp-search" (submit)="search($event, searchInput.value)">
          <label [for]="searchId">{{ 'ACP.SEARCH' | translate }}</label>
          <div>
            <input #searchInput pInputText [id]="searchId" type="search" maxlength="80"
              [value]="query" [disabled]="effectiveState !== 'ready'"
              [attr.aria-describedby]="effectiveState !== 'ready' ? searchId + '-help' : null" />
            <button pButton type="submit" [disabled]="effectiveState !== 'ready'">{{ 'ACP.SEARCH' | translate }}</button>
          </div>
          @if (effectiveState !== 'ready') {
            <small [id]="searchId + '-help'">{{ 'ACP.SEARCH_PENDING' | translate }}</small>
          }
        </form>
      }
      @if (columns.length) {
        <p-table [value]="filteredRows" [paginator]="effectiveState === 'ready' && filteredRows.length > pageSize"
          [rows]="pageSize" [first]="first" (onPage)="changePage($event)"
          [tableStyle]="{'min-width': '36rem'}" [rowTrackBy]="trackRow">
          <ng-template #header>
            <tr>
              @for (column of columns; track $index) { <th scope="col">{{ column | translate }}</th> }
              <th scope="col">{{ 'ACP.ACTIONS' | translate }}</th>
            </tr>
          </ng-template>
          <ng-template #body let-row>
            <tr>
              @for (cell of row.cells; track $index) { <td>{{ cell }}</td> }
              <td><a [routerLink]="row.link" [queryParams]="returnParams"
                [attr.aria-label]="('ACP.VIEW_DETAILS' | translate) + ' #' + row.id">
                {{ 'ACP.VIEW_DETAILS' | translate }}</a></td>
            </tr>
          </ng-template>
          <ng-template #emptymessage></ng-template>
        </p-table>
        @if (!filteredRows.length) { <xdr-acp-state [state]="displayState" /> }
      } @else {
        <xdr-acp-state [state]="state === 'ready' ? 'empty' : state" />
        <p class="acp-muted">{{ 'ACP.COLUMNS_PENDING' | translate }}</p>
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcpTableComponent {
  private readonly demo = inject(AcpDemoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly params = toSignal(this.route.queryParamMap, { initialValue: this.route.snapshot.queryParamMap });
  @Input({ required: true }) heading = '';
  @Input() columns: readonly string[] = [];
  @Input() rows: AcpTableRow[] = [];
  @Input() state: AcpDataState = 'pending';
  @Input() searchable = false;
  @Input() demoPath = '';
  get effectiveState(): AcpDataState { return this.demo.list(this.demoPath) ? 'ready' : this.state; }
  readonly pageSize = 10;
  get searchId(): string { return 'acp-search-' + this.heading.replace(/[^a-z0-9]/gi, '-'); }
  get query(): string { return (this.params().get('q') ?? '').trim().slice(0, 80); }
  get filteredRows(): AcpTableRow[] {
    if (this.effectiveState !== 'ready') return [];
    const query = this.searchable ? this.query.toLocaleLowerCase() : '';
    return (this.demo.list(this.demoPath)?.rows ?? this.rows)
      .filter(row => !query || row.cells.some(cell => cell.toLocaleLowerCase().includes(query)));
  }
  get first(): number {
    const value = this.params().get('page') ?? '1';
    const page = /^[1-9]\d*$/.test(value) && Number.isSafeInteger(Number(value)) ? Number(value) : 1;
    const lastPage = Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
    return (Math.min(page, lastPage) - 1) * this.pageSize;
  }
  get returnParams(): { q: string | null; page: number } {
    return { q: this.searchable ? this.query || null : null, page: this.first / this.pageSize + 1 };
  }
  get displayState(): AcpDataState {
    return this.effectiveState === 'ready' ? (this.searchable && this.query ? 'noResults' : 'empty') : this.effectiveState;
  }
  readonly trackRow = (_index: number, row: AcpTableRow): string => row.id;
  search(event: Event, value: string): void {
    event.preventDefault();
    if (this.effectiveState !== 'ready') return;
    void this.router.navigate([], {
      relativeTo: this.route, queryParams: { q: value.trim().slice(0, 80) || null, page: 1 }, queryParamsHandling: 'merge'
    });
  }
  changePage(event: TablePageEvent): void {
    void this.router.navigate([], {
      relativeTo: this.route, queryParams: { page: event.first / this.pageSize + 1 }, queryParamsHandling: 'merge'
    });
  }
}
