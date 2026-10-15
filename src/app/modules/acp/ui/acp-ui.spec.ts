import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AcpTableComponent, AcpTableRow } from './acp-table.component';
import { AcpDataState, AcpStateComponent } from './acp-state.component';
import { AcpFeedbackComponent, CURRENCY_ADDED_MESSAGE } from './acp-feedback.component';
import { AcpRecordComponent } from './acp-record.component';

describe('ACP shared UI', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AcpTableComponent, AcpStateComponent, AcpFeedbackComponent],
      providers: [
        provideNoopAnimations(),
        provideRouter([
          { path: 'list', component: AcpTableComponent },
          { path: 'list/:id', component: AcpRecordComponent }
        ])
      ]
    });
  });

  it('distinguishes each unavailable, loading, error, and empty state', () => {
    const fixture = TestBed.createComponent(AcpStateComponent);
    for (const state of ['pending', 'definition', 'loading', 'error', 'empty', 'noResults', 'notFound'] as AcpDataState[]) {
      fixture.componentRef.setInput('state', state);
      fixture.detectChanges();
      const status: HTMLElement = fixture.nativeElement.querySelector('[data-state]');
      expect(status.dataset['state']).toBe(state);
      expect(status.getAttribute('role')).toBe(state === 'error' ? 'alert' : 'status');
      expect(status.getAttribute('aria-busy')).toBe(String(state === 'loading'));
    }
    fixture.componentRef.setInput('state', 'ready');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-state]')).toBeNull();
  });

  it('does not render supplied stale rows while pending or failing', async () => {
    const harness = await RouterTestingHarness.create('/list');
    const component = harness.routeDebugElement!.componentInstance as AcpTableComponent;
    component.columns = ['ID', 'Name'];
    component.rows = [{ id: '1', cells: ['1', 'Test-only player'], link: ['/list', '1'] }];
    for (const state of ['pending', 'loading', 'error'] as AcpDataState[]) {
      component.state = state;
      harness.routeDebugElement!.injector.get(ChangeDetectorRef).markForCheck();
      harness.detectChanges();
      expect(component.filteredRows).toEqual([]);
      expect(harness.routeNativeElement!.textContent).not.toContain('Test-only player');
    }
  });

  it('paginates ten records, filters, and persists query/page in detail links', async () => {
    const harness = await RouterTestingHarness.create('/list?page=2');
    const component = harness.routeDebugElement!.componentInstance as AcpTableComponent;
    component.heading = 'Players';
    component.columns = ['ID', 'Name'];
    component.searchable = true;
    component.state = 'ready';
    component.rows = Array.from({ length: 23 }, (_, index): AcpTableRow => ({
      id: String(index + 1), cells: [String(index + 1), `Test player ${index + 1}`], link: ['/list', String(index + 1)]
    }));
    harness.routeDebugElement!.injector.get(ChangeDetectorRef).markForCheck();
    harness.detectChanges();
    expect(component.first).toBe(10);
    expect(harness.routeNativeElement!.querySelectorAll('tbody tr').length).toBe(10);
    expect(harness.routeNativeElement!.querySelector<HTMLAnchorElement>('tbody a')?.getAttribute('href'))
      .toBe('/list/11?page=2');
    const input = harness.routeNativeElement!.querySelector<HTMLInputElement>('input')!;
    input.value = '  player 23  ';
    harness.routeNativeElement!.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/list?page=1&q=player%2023');
    expect(component.filteredRows.length).toBe(1);
    expect(component.first).toBe(0);
    expect(harness.routeNativeElement!.querySelector<HTMLAnchorElement>('tbody a')?.getAttribute('href'))
      .toBe('/list/23?q=player%2023&page=1');
    await TestBed.inject(Router).navigateByUrl('/list?q=nothing&page=1');
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('[data-state="noResults"]')).not.toBeNull();
    await TestBed.inject(Router).navigateByUrl('/list');
    component.rows = [];
    harness.routeDebugElement!.injector.get(ChangeDetectorRef).markForCheck();
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('[data-state="empty"]')).not.toBeNull();
  });

  it('normalizes malformed page numbers and preserves query when paginating', async () => {
    const harness = await RouterTestingHarness.create('/list?q=Test&page=-2');
    const component = harness.routeDebugElement!.componentInstance as AcpTableComponent;
    component.state = 'ready';
    component.searchable = true;
    component.rows = Array.from({ length: 12 }, (_, index) => ({
      id: String(index), cells: ['Test'], link: ['/list', String(index)]
    }));
    harness.detectChanges();
    expect(component.first).toBe(0);
    component.changePage({ first: 10, rows: 10 });
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/list?q=Test&page=2');
    await TestBed.inject(Router).navigateByUrl('/list?page=999999999999999999999999');
    harness.detectChanges();
    expect(component.first).toBe(0);
    await TestBed.inject(Router).navigateByUrl('/list?page=500');
    harness.detectChanges();
    expect(component.first).toBe(10);
  });

  it('does not navigate or pretend to search while integration is pending', async () => {
    const harness = await RouterTestingHarness.create('/list');
    const component = harness.routeDebugElement!.componentInstance as AcpTableComponent;
    const router = TestBed.inject(Router);
    const navigate = spyOn(router, 'navigate');
    component.search(new Event('submit'), 'Player');
    expect(navigate).not.toHaveBeenCalled();
    expect(component.state).toBe('pending');
  });

  it('renders the exact Currency success text only when explicitly provided and errors as alerts', () => {
    const fixture = TestBed.createComponent(AcpFeedbackComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.acp-feedback')).toBeNull();
    fixture.componentRef.setInput('message', CURRENCY_ADDED_MESSAGE);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent)
      .toBe('Currency added to the database. Add it to `external_variables` to make it available in the hotel.');
    fixture.componentRef.setInput('kind', 'error');
    fixture.componentRef.setInput('message', 'Test-only failure');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')?.textContent).toBe('Test-only failure');
  });
});
