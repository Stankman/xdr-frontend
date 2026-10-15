import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'xdr-acp-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  readonly stats = [
    { label: 'ACP.TOTAL_PLAYERS', icon: 'pi pi-id-card', color: 'blue' },
    { label: 'ACP.TOTAL_ACCOUNTS', icon: 'pi pi-users', color: 'purple' },
    { label: 'ACP.ONLINE_PLAYERS', icon: 'pi pi-globe', color: 'green' },
    { label: 'ACP.ACTIVE_REPORTS', icon: 'pi pi-flag', color: 'orange' }
  ];
  readonly links = [
    { path: 'players', label: 'Players', icon: 'pi pi-id-card' },
    { path: 'accounts', label: 'Accounts', icon: 'pi pi-users' },
    { path: 'moderation', label: 'Moderation', icon: 'pi pi-shield' }
  ];
}
