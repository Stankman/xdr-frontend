import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { acpSections } from './acp-sections';

describe('ACP workspace', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        provideNoopAnimations(),
        provideRouter([{
          path: 'acp',
          loadChildren: () => import('./acp.module').then(m => m.AcpModule)
        }])
      ]
    });
  });

  it('redirects to Dashboard, preserves branding/palette and groups only included areas', async () => {
    const harness = await RouterTestingHarness.create('/acp');
    const host = harness.routeNativeElement!;
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(harness.fixture.nativeElement);
    harness.fixture.componentRef.onDestroy(() => container.remove());
    expect(TestBed.inject(Router).url).toBe('/acp/dashboard');
    expect(host.querySelector<HTMLImageElement>('.acp-brand img')?.getAttribute('src'))
      .toBe('/assets/resources/images/xdr_icon_dark_logo.png');
    expect(host.querySelectorAll('.acp-navigation .acp-nav-button').length).toBe(13);
    expect(host.querySelectorAll('.acp-nav-group').length).toBe(3);
    expect(host.querySelector('[aria-label="Achievements"]')).toBeNull();
    expect(host.querySelector('[aria-label="Subscriptions"]')).toBeNull();
    expect(getComputedStyle(host.querySelector<HTMLElement>('.acp-navigation')!).overflowY).toBe('auto');
    expect(getComputedStyle(host.querySelector<HTMLElement>('.acp-shell')!).backgroundColor).toBe('rgb(41, 43, 47)');
    expect(getComputedStyle(host.querySelector<HTMLElement>('.acp-sidebar')!).backgroundColor).toBe('rgb(32, 34, 37)');
    expect(getComputedStyle(host.querySelector<HTMLElement>('.acp-panel')!).backgroundColor).toBe('rgb(47, 49, 54)');
  });

  it('loads every included area and its contextual submenu', async () => {
    const harness = await RouterTestingHarness.create();
    for (const section of acpSections) {
      await harness.navigateByUrl(`/acp/${section.path}`);
      const host = harness.routeNativeElement!;
      const label = section.children?.[0].label ?? section.label;
      expect(host.querySelector('h1')?.textContent?.trim()).toBe(label);
      expect(host.querySelector('.acp-nav-button.active')?.getAttribute('aria-label')).toBe(section.label);
      expect(host.querySelector('.acp-nav-button.active')?.getAttribute('aria-current')).toBe('page');
      expect(host.querySelectorAll('.acp-sub-sidebar nav a').length).toBe(section.children?.length ?? 1);
      expect(host.querySelector('.acp-sub-sidebar nav a.active')).not.toBeNull();
    }
  });

  it('shows unavailable metrics rather than fabricated totals and activity', async () => {
    const harness = await RouterTestingHarness.create('/acp/dashboard');
    const host = harness.routeNativeElement!;
    expect(host.querySelectorAll('.acp-stat-card').length).toBe(4);
    expect(Array.from(host.querySelectorAll('.acp-stat-value')).map(el => el.textContent?.trim()))
      .toEqual(['—', '—', '—', '—']);
    expect(host.querySelector('.acp-activity-row')).toBeNull();
    expect(host.textContent).not.toContain('PixelRider');
    expect(host.textContent).not.toContain('12,840');
    expect(host.querySelector('.acp-activity-panel [data-state="pending"]')).not.toBeNull();
    expect(host.querySelector('.acp-quick-links a[href="/acp/articles"]')).toBeNull();
  });

  it('keeps Catalog selected on nested details and navigates through contextual links', async () => {
    const harness = await RouterTestingHarness.create('/acp/catalog/pages/42');
    const host = harness.routeNativeElement!;
    expect(host.querySelector('h1')?.textContent).toContain('Catalog Pages');
    expect(host.querySelector('.acp-breadcrumb')?.textContent).toContain('#42');
    expect(host.querySelector('.acp-nav-button.active')?.getAttribute('aria-label')).toBe('Catalog');
    expect(host.querySelector('.acp-sub-sidebar a.active')?.textContent).toContain('Catalog Pages');
    expect(host.querySelector<HTMLAnchorElement>('.acp-back')?.getAttribute('href')).toBe('/acp/catalog/pages');
    host.querySelector<HTMLAnchorElement>('.acp-sub-sidebar a[href="/acp/catalog/furniture"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/acp/catalog/furniture');
    expect(host.querySelectorAll('.acp-sub-sidebar a').length).toBe(3);
  });

  it('restores list query state on return from a direct detail link', async () => {
    const harness = await RouterTestingHarness.create('/acp/players/42?q=Pixel&page=2');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('.acp-back')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(TestBed.inject(Router).url).toBe('/acp/players?q=Pixel&page=2');
    expect(harness.routeNativeElement!.querySelector<HTMLInputElement>('input[type="search"]')?.value).toBe('Pixel');
  });

  it('keeps unconnected searches disabled and distinguishes pending from empty', async () => {
    const harness = await RouterTestingHarness.create();
    for (const path of ['players', 'rooms']) {
      await harness.navigateByUrl('/acp/' + path);
      const host = harness.routeNativeElement!;
      expect(host.querySelector<HTMLInputElement>('input[type="search"]')?.disabled).toBeTrue();
      expect(host.querySelectorAll('th').length).toBe(5);
      expect(host.querySelector('[data-state="pending"]')).not.toBeNull();
      expect(host.querySelector('[data-state="empty"]')).toBeNull();
      expect(host.querySelector('tbody a')).toBeNull();
    }
  });

  it('renders all agreed detail sections without undefined actions or transactions', async () => {
    const harness = await RouterTestingHarness.create('/acp/rooms/7');
    let host = harness.routeNativeElement!;
    expect(host.querySelectorAll('.acp-detail-grid .acp-panel').length).toBe(8);
    for (const key of ['RATERS', 'VISITOR_LOGS', 'CHATLOGS', 'ROOM_WORDFILTER', 'RIGHTS', 'MUTED_USERS', 'ROOM_BANS', 'EVENT_HISTORY']) {
      expect(host.textContent).toContain('ACP.' + key);
    }
    expect(host.querySelector('.acp-record-actions')).toBeNull();
    await harness.navigateByUrl('/acp/players/7');
    host = harness.routeNativeElement!;
    expect(host.textContent).toContain('ACP.ACCOUNT');
    expect(host.textContent).toContain('ACP.BADGE_COUNT');
    expect(host.querySelector<HTMLButtonElement>('.acp-record-actions button')?.disabled).toBeTrue();
    expect(host.querySelector<HTMLAnchorElement>('a[href="/acp/bans/new?player=7"]')).not.toBeNull();
    expect(host.textContent?.toLowerCase()).not.toContain('transaction');
    await harness.navigateByUrl('/acp/catalog/furniture/7');
    expect(harness.routeNativeElement!.textContent).toContain('ACP.ASSOCIATED_OFFER');
    expect(harness.routeNativeElement!.textContent?.toLowerCase()).not.toContain('transaction');
  });

  it('reuses the blocked ban flow from Players without claiming the player is verified', async () => {
    const harness = await RouterTestingHarness.create('/acp/players/7');
    harness.routeNativeElement!.querySelector<HTMLAnchorElement>('a[href="/acp/bans/new?player=7"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    const host = harness.routeNativeElement!;
    expect(TestBed.inject(Router).url).toBe('/acp/bans/new?player=7');
    expect(host.textContent).toContain('#7');
    expect(host.textContent).toContain('ACP.PLAYER_UNVERIFIED');
    expect(host.querySelector<HTMLButtonElement>('.acp-panel button')?.disabled).toBeTrue();
    expect(host.querySelector('input')).toBeNull();
  });

  it('keeps creation and destructive actions blocked, without success-shaped feedback', async () => {
    const harness = await RouterTestingHarness.create();
    for (const path of ['currencies/new', 'wordfilters/new', 'bans/new', 'wordfilters/5', 'bans/5']) {
      await harness.navigateByUrl('/acp/' + path);
      const host = harness.routeNativeElement!;
      const buttons = Array.from(host.querySelectorAll<HTMLButtonElement>('.acp-panel button'));
      expect(buttons.length).toBeGreaterThan(0);
      expect(buttons.every(button => button.disabled)).toBeTrue();
      expect(host.querySelector('.acp-feedback')).toBeNull();
      expect(host.querySelector('form')).toBeNull();
    }
  });

  it('separates hotel and web groups and shows their corresponding members', async () => {
    const harness = await RouterTestingHarness.create('/acp/permissions/hotel/1');
    expect(harness.routeNativeElement!.querySelector('.acp-detail-grid')?.textContent).toContain('Players');
    expect(harness.routeNativeElement!.textContent).toContain('ACP.INHERITED_GROUPS');
    await harness.navigateByUrl('/acp/permissions/web/1');
    expect(harness.routeNativeElement!.querySelector('.acp-detail-grid')?.textContent).toContain('Accounts');
    expect(harness.routeNativeElement!.querySelector('.acp-sub-sidebar a.active')?.textContent).toContain('ACP.WEB_GROUPS');
    expect(harness.routeNativeElement!.querySelector('.acp-record-actions')).toBeNull();
    await harness.navigateByUrl('/acp/accounts/1');
    expect(harness.routeNativeElement!.textContent).toContain('ACP.SESSIONS');
    expect(harness.routeNativeElement!.textContent).toContain('ACP.AVATARS');
  });

  it('keeps undefined pages explicitly pending, not empty CRUD screens', async () => {
    const harness = await RouterTestingHarness.create();
    for (const path of ['articles', 'audit-logs', 'settings/web', 'settings/hotel', 'catalog/featured']) {
      await harness.navigateByUrl('/acp/' + path);
      expect(harness.routeNativeElement!.querySelector('[data-state="definition"]')).not.toBeNull();
      expect(harness.routeNativeElement!.querySelector('table, input, .acp-record-actions')).toBeNull();
    }
    await harness.navigateByUrl('/acp/unknown-section');
    expect(TestBed.inject(Router).url).toBe('/acp/dashboard');
    await harness.navigateByUrl('/acp/catalog/not-a-page');
    expect(TestBed.inject(Router).url).toBe('/acp/dashboard');
  });

  it('closes the contextual panel on Escape and navigation, restoring toggle focus', async () => {
    const harness = await RouterTestingHarness.create('/acp/catalog/pages');
    const host = harness.routeNativeElement!;
    document.body.appendChild(harness.fixture.nativeElement);
    harness.fixture.componentRef.onDestroy(() => harness.fixture.nativeElement.remove());
    const toggle = host.querySelector<HTMLButtonElement>('.acp-submenu-toggle')!;
    toggle.style.display = 'grid';
    toggle.click();
    harness.detectChanges();
    await harness.fixture.whenStable();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(host.querySelector('.acp-sub-sidebar.is-open')).not.toBeNull();
    expect(document.activeElement).toBe(host.querySelector('.acp-sub-sidebar a.active'));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    harness.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(toggle);
    toggle.click();
    harness.detectChanges();
    host.querySelector<HTMLAnchorElement>('.acp-sub-sidebar a[href="/acp/catalog/furniture"]')!.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(host.querySelector('.acp-sub-sidebar.is-open')).toBeNull();
  });

  it('retains sidebar tooltips on hover and keyboard focus', async () => {
    const harness = await RouterTestingHarness.create('/acp/dashboard');
    const link = harness.routeNativeElement!.querySelector<HTMLAnchorElement>('[aria-label="Accounts"]')!;
    link.dispatchEvent(new MouseEvent('mouseenter'));
    await harness.fixture.whenStable();
    expect(document.body.querySelector('.acp-navigation-tooltip')?.textContent?.trim()).toBe('Accounts');
    link.dispatchEvent(new MouseEvent('mouseleave'));
    await harness.fixture.whenStable();
    link.dispatchEvent(new FocusEvent('focus'));
    await harness.fixture.whenStable();
    expect(document.body.querySelector('.acp-navigation-tooltip')?.textContent?.trim()).toBe('Accounts');
    link.dispatchEvent(new FocusEvent('blur'));
    await harness.fixture.whenStable();
    expect(document.body.querySelector('.acp-navigation-tooltip')).toBeNull();
  });

  it('contains tables and contextual menus at 320px/375px and keeps pending copy readable in the light web theme', async () => {
    const harness = await RouterTestingHarness.create('/acp/catalog/pages');
    const frame = document.createElement('iframe');
    frame.style.height = '900px';
    frame.style.border = '0';
    document.body.appendChild(frame);
    harness.fixture.componentRef.onDestroy(() => frame.remove());
    const frameDocument = frame.contentDocument!;
    const style = frameDocument.createElement('style');
    style.textContent = Array.from(document.styleSheets)
      .filter(sheet => !sheet.href || new URL(sheet.href).origin === location.origin)
      .map(sheet => Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n')).join('\n');
    frameDocument.head.appendChild(style);
    frameDocument.body.className = 'light';
    frameDocument.body.appendChild(harness.fixture.nativeElement.cloneNode(true));
    const view = frame.contentWindow!;
    for (const width of [1440, 375, 320]) {
      frame.style.width = width + 'px';
      const root = frameDocument.documentElement;
      const submenu = frameDocument.querySelector<HTMLElement>('.acp-sub-sidebar')!;
      expect(root.scrollWidth).withContext(`document at ${width}px`).toBeLessThanOrEqual(width);
      expect(view.getComputedStyle(submenu).display).toBe(width > 900 ? 'flex' : 'none');
      const state = frameDocument.querySelector<HTMLElement>('.acp-data-state')!;
      expect(state.getBoundingClientRect().right).toBeLessThanOrEqual(width);
      expect(view.getComputedStyle(state.querySelector('p')!).color).toBe('rgb(153, 170, 181)');
      if (width <= 900) {
        const table = frameDocument.querySelector<HTMLElement>('.p-datatable-table-container')!;
        expect(table.scrollWidth).toBeGreaterThan(table.clientWidth);
        submenu.classList.add('is-open');
        expect(view.getComputedStyle(submenu).display).toBe('flex');
        expect(root.scrollWidth).toBeLessThanOrEqual(width);
        submenu.classList.remove('is-open');
      }
    }
  });

  it('updates the ban target when navigating between reused player detail routes', async () => {
    const harness = await RouterTestingHarness.create('/acp/players/7');
    await harness.navigateByUrl('/acp/players/8');
    expect(harness.routeNativeElement!.querySelector('a[href="/acp/bans/new?player=8"]')).not.toBeNull();
    expect(harness.routeNativeElement!.querySelector('a[href="/acp/bans/new?player=7"]')).toBeNull();
  });

  it('loads real English/Spanish ACP copy without duplicate namespaces or visible translation keys', async () => {
    const harness = await RouterTestingHarness.create('/acp/players');
    const translate = TestBed.inject(TranslateService);
    for (const [language, pending, search] of [
      ['en', 'Pending integration', 'Search'],
      ['es', 'Pendiente de integración', 'Buscar']
    ]) {
      const response = await fetch(`/assets/lang/${language}.json`);
      expect(response.ok).toBeTrue();
      const source = await response.text();
      expect(source.match(/^  "ACP":/gm)?.length).toBe(1);
      translate.setTranslation(language, JSON.parse(source));
      translate.use(language);
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(harness.routeNativeElement!.textContent).toContain(pending);
      expect(harness.routeNativeElement!.textContent).toContain(search);
      expect(harness.routeNativeElement!.textContent).not.toContain('ACP.STATE.');
      expect(harness.routeNativeElement!.textContent).not.toContain('ACP.AVATAR_NAME');
    }
  });
});
