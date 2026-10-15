import { Component, DestroyRef, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ThemeService } from '../../../services/theme.service';
import { environment } from 'src/environments/environment';
import { AccountService } from '../../../services/account.service';

@Component({
    selector: 'xdr-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FooterComponent implements OnInit {
  public readonly hotelName = environment.app.hotelName;
  public readonly year = new Date().getFullYear();
  public isLogged = false;

  public themeName : string = 'light';
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    public themeService : ThemeService,
    private readonly accounts: AccountService
  ) { }

  ngOnInit() {
    this.accounts.accountObservable.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(account => this.isLogged = !!account);
    this.themeService.getThemeSubject().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value : boolean) => {
      this.themeName = this.themeService.getThemeName();
    })
  }

}
