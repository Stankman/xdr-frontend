import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { AcpDemoService } from './acp-demo.service';

describe('ACP opt-in demo records', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([{
          path: 'acp',
          loadChildren: () => import('./acp.module').then(module => module.AcpModule)
        }])
      ]
    });
  });

  it('defaults off and never mutates browser storage when toggled', () => {
    const storage = spyOn(Storage.prototype, 'setItem');
    const demo = TestBed.inject(AcpDemoService);
    expect(demo.enabled()).toBeFalse();
    expect(demo.list('players')).toBeUndefined();
    demo.toggle();
    expect(demo.list('players')?.rows.length).toBe(24);
    demo.toggle();
    expect(demo.record('players', '1')).toBeUndefined();
    expect(storage).not.toHaveBeenCalled();
  });

  it('enables real table pagination/search and returns to pending when hidden', async () => {
    const harness = await RouterTestingHarness.create('/acp/players');
    const host = harness.routeNativeElement!;
    const toggle = host.querySelector<HTMLButtonElement>('.acp-demo-notice button')!;
    expect(host.querySelectorAll('tbody tr').length).toBe(0);
    expect(host.querySelector<HTMLInputElement>('input')?.disabled).toBeTrue();
    toggle.click();
    harness.detectChanges();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(host.querySelector('.acp-demo-notice.is-demo')).not.toBeNull();
    expect(host.querySelectorAll('tbody tr').length).toBe(10);
    expect(host.textContent).toContain('DemoPlayer01');
    expect(host.querySelector<HTMLInputElement>('input')?.disabled).toBeFalse();
    expect(host.querySelector('.p-paginator')).not.toBeNull();
    await harness.navigateByUrl('/acp/players?page=3');
    expect(host.querySelectorAll('tbody tr').length).toBe(4);
    expect(host.textContent).toContain('DemoPlayer24');
    const input = host.querySelector<HTMLInputElement>('input')!;
    input.value = 'DemoPlayer24';
    host.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(host.querySelectorAll('tbody tr').length).toBe(1);
    expect(host.querySelector<HTMLAnchorElement>('tbody a')?.getAttribute('href'))
      .toBe('/acp/players/24?q=DemoPlayer24&page=1');
    host.querySelector<HTMLButtonElement>('.acp-demo-notice button')!.click();
    harness.detectChanges();
    expect(host.querySelectorAll('tbody tr').length).toBe(0);
    expect(host.querySelector('[data-state="pending"]')).not.toBeNull();
    expect(host.textContent).not.toContain('DemoPlayer24');
  });

  it('opens matching records, preserves list state, and keeps mutations disabled', async () => {
    TestBed.inject(AcpDemoService).toggle();
    const harness = await RouterTestingHarness.create('/acp/players?q=DemoPlayer12&page=1');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('tbody a')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    const host = harness.routeNativeElement!;
    expect(TestBed.inject(Router).url).toBe('/acp/players/12?q=DemoPlayer12&page=1');
    expect(host.querySelector('dl')?.textContent).toContain('DemoPlayer12');
    expect(host.querySelector('dl')?.textContent).toContain('demo12@example.invalid');
    expect(host.textContent).toContain('Demo credits: 210');
    expect(host.querySelector<HTMLButtonElement>('.acp-record-actions button')?.disabled).toBeTrue();
    host.querySelector<HTMLAnchorElement>('.acp-back')!.click();
    await harness.fixture.whenStable();
    expect(TestBed.inject(Router).url).toBe('/acp/players?q=DemoPlayer12&page=1');
  });

  it('shows not found without actions for missing demo IDs, then restores normal pending state', async () => {
    const demo = TestBed.inject(AcpDemoService);
    demo.toggle();
    const harness = await RouterTestingHarness.create('/acp/players/999');
    expect(harness.routeNativeElement!.querySelector('[data-state="notFound"]')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelector('.acp-record-actions')).toBeNull();
    demo.toggle();
    harness.detectChanges();
    expect(harness.routeNativeElement!.querySelector('[data-state="pending"]')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelector('[data-state="notFound"]')).toBeNull();
  });

  it('renders room collections and linked Catalog records without filling undefined screens', async () => {
    TestBed.inject(AcpDemoService).toggle();
    const harness = await RouterTestingHarness.create('/acp/rooms/2');
    expect(harness.routeNativeElement!.textContent).toContain('Demo room 02');
    expect(harness.routeNativeElement!.querySelector('a[href="/acp/players/2"]')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelectorAll('[data-state="empty"]').length).toBe(2);
    await harness.navigateByUrl('/acp/catalog/pages/1');
    expect(harness.routeNativeElement!.querySelector('a[href="/acp/catalog/pages/2"]')).not.toBeNull();
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a[href="/acp/catalog/furniture/1"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(harness.routeNativeElement!.textContent).toContain('Demo chair');
    expect(harness.routeNativeElement!.querySelector('a[href="/acp/catalog/pages/1"]')).not.toBeNull();
    await harness.navigateByUrl('/acp/catalog/featured');
    expect(harness.routeNativeElement!.querySelector('[data-state="definition"]')).not.toBeNull();
    await harness.navigateByUrl('/acp/accounts');
    expect(harness.routeNativeElement!.querySelector('[data-state="pending"]')).not.toBeNull();
    await harness.navigateByUrl('/acp/dashboard');
    expect(Array.from(harness.routeNativeElement!.querySelectorAll('.acp-stat-value')).map(el => el.textContent?.trim()))
      .toEqual(['—', '—', '—', '—']);
  });

  it('has consistent row shapes and resolvable synthetic relationships', () => {
    const demo = TestBed.inject(AcpDemoService);
    demo.toggle();
    for (const path of ['players', 'rooms', 'catalog/pages', 'catalog/furniture']) {
      const list = demo.list(path)!;
      expect(new Set(list.rows.map(row => row.id)).size).toBe(list.rows.length);
      for (const row of list.rows) {
        expect(row.cells.length).toBe(list.columns.length);
        expect(row.cells.every(cell => typeof cell === 'string' && cell.length > 0)).toBeTrue();
        const record = demo.record(path, row.id)!;
        expect(record).toBeDefined();
        for (const entries of Object.values(record.collections)) {
          for (const entry of entries) {
            if (entry.link) {
              const target = entry.link.join('/').replace('/acp/', '');
              const separator = target.lastIndexOf('/');
              expect(demo.record(target.slice(0, separator), target.slice(separator + 1)))
                .withContext(entry.link.join('/')).toBeDefined();
            }
          }
        }
      }
    }
  });
});
