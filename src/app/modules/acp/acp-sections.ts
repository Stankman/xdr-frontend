import { Route } from '@angular/router';
import { AcpNavigationItem } from '../shared/layout/acp/sidebar/sidebar.component';

export interface AcpSection extends AcpNavigationItem {
  group: 'GENERAL' | 'HOTEL' | 'ADMIN';
  children?: readonly { path: string; label: string }[];
  loadChildren: NonNullable<Route['loadChildren']>;
}

export const acpSections: readonly AcpSection[] = [
  {
    path: 'dashboard', label: 'Dashboard', icon: 'pi pi-home', group: 'GENERAL',
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'players', label: 'Players', icon: 'pi pi-id-card', group: 'HOTEL',
    loadChildren: () => import('./modules/players/players.module').then(m => m.PlayersModule)
  },
  {
    path: 'rooms', label: 'Rooms', icon: 'pi pi-building', group: 'HOTEL',
    loadChildren: () => import('./modules/rooms/rooms.module').then(m => m.RoomsModule)
  },
  {
    path: 'catalog', label: 'Catalog', icon: 'pi pi-shopping-cart', group: 'HOTEL',
    children: [
      { path: 'pages', label: 'Catalog Pages' },
      { path: 'featured', label: 'Catalog Featured Pages' },
      { path: 'furniture', label: 'Furniture Definitions' }
    ],
    loadChildren: () => import('./modules/catalog/catalog.module').then(m => m.CatalogModule)
  },
  {
    path: 'currencies', label: 'Currencies', icon: 'pi pi-wallet', group: 'HOTEL',
    loadChildren: () => import('./modules/currencies/currencies.module').then(m => m.CurrenciesModule)
  },
  {
    path: 'wordfilters', label: 'WordFilter', icon: 'pi pi-filter', group: 'HOTEL',
    loadChildren: () => import('./modules/wordfilters/wordfilters.module').then(m => m.WordfiltersModule)
  },
  {
    path: 'moderation', label: 'Moderation', icon: 'pi pi-shield', group: 'HOTEL',
    loadChildren: () => import('./modules/moderation/moderation.module').then(m => m.ModerationModule)
  },
  {
    path: 'bans', label: 'Bans', icon: 'pi pi-ban', group: 'HOTEL',
    loadChildren: () => import('./modules/bans/bans.module').then(m => m.BansModule)
  },
  {
    path: 'accounts', label: 'Accounts', icon: 'pi pi-users', group: 'ADMIN',
    loadChildren: () => import('./modules/accounts/accounts.module').then(m => m.AccountsModule)
  },
  {
    path: 'articles', label: 'Articles', icon: 'pi pi-file-edit', group: 'ADMIN',
    loadChildren: () => import('./modules/articles/articles.module').then(m => m.ArticlesModule)
  },
  {
    path: 'permissions', label: 'Permissions', icon: 'pi pi-lock', group: 'ADMIN',
    children: [
      { path: 'hotel', label: 'ACP.HOTEL_GROUPS' },
      { path: 'web', label: 'ACP.WEB_GROUPS' }
    ],
    loadChildren: () => import('./modules/permissions/permissions.module').then(m => m.PermissionsModule)
  },
  {
    path: 'audit-logs', label: 'Audit Logs', icon: 'pi pi-history', group: 'ADMIN',
    loadChildren: () => import('./modules/audit-logs/audit-logs.module').then(m => m.AuditLogsModule)
  },
  {
    path: 'settings', label: 'Settings', icon: 'pi pi-cog', group: 'ADMIN',
    children: [
      { path: 'web', label: 'ACP.WEB_SETTINGS' },
      { path: 'hotel', label: 'ACP.HOTEL_SETTINGS' }
    ],
    loadChildren: () => import('./modules/settings/settings.module').then(m => m.SettingsModule)
  }
];
