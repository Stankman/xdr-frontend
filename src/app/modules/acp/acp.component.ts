import { Component, ChangeDetectionStrategy, ElementRef, HostListener, Injector, ViewChild, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { acpSections } from './acp-sections';
import { AcpDemoService } from './acp-demo.service';

@Component({
    selector: 'app-acp',
    templateUrl: './acp.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AcpComponent {
  readonly demo = inject(AcpDemoService);
  @ViewChild('submenuToggle') private submenuToggle?: ElementRef<HTMLButtonElement>;
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  public readonly navigationItems = acpSections;
  public submenuOpen = false;
  public readonly context = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => {
      let leaf = this.route;
      while (leaf.firstChild) leaf = leaf.firstChild;
      return {
        label: leaf.snapshot.data['pageLabel'] as string | undefined,
        detail: leaf.snapshot.data['detail'] === true,
        id: leaf.snapshot.paramMap.get('id')
      };
    })
  );
  public readonly section = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null),
    map(() => acpSections.find(section => section.path === this.route.firstChild?.snapshot.routeConfig?.path))
  );

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed()
    ).subscribe(() => this.closeSubmenu());
  }

  public toggleSubmenu(): void {
    if (this.submenuOpen) {
      this.closeSubmenu();
    } else {
      this.submenuOpen = true;
      afterNextRender(() => {
        if (this.submenuOpen) {
          this.host.nativeElement.querySelector<HTMLAnchorElement>('.acp-sub-sidebar a.active')?.focus();
        }
      }, { injector: this.injector });
    }
  }

  @HostListener('document:keydown.escape')
  public closeSubmenu(): void {
    if (this.submenuOpen) {
      this.submenuOpen = false;
      this.submenuToggle?.nativeElement.focus();
    }
  }
}
