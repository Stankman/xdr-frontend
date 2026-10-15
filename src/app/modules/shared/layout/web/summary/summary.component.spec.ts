import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { Account } from 'src/app/modules/core/models/account/account.model';
import { Avatar } from 'src/app/modules/core/models/avatar/avatar.model';
import { SharedModule } from '../../../shared.module';
import { AccountService } from '../../../services/account.service';
import { LookService } from '../../../services/look.service';
import { SummaryComponent } from './summary.component';

describe('Summary green hotel entry', () => {
  it('uses the shared finish without moving its icon or changing its destination', async () => {
    const avatar = Object.assign(new Avatar(), {
      username: 'Pixel Guest', look: '', motto: '', credits: 10, lastLogin: 0
    });
    await TestBed.configureTestingModule({
      imports: [SharedModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      providers: [
        { provide: AccountService, useValue: { accountObservable: of(Object.assign(new Account(), { activeAvatar: avatar })) } },
        { provide: LookService, useValue: { get: () => '/assets/resources/images/habbo_new_avatar.png' } }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(SummaryComponent);
    fixture.detectChanges();
    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('.hotel-enter');
    const style = getComputedStyle(link);
    expect(link.classList.contains('web-green-button')).toBeTrue();
    expect(link.getAttribute('href')).toBe('/client');
    expect(style.backgroundColor).toBe('rgb(0, 129, 62)');
    expect(style.borderColor).toBe('rgb(142, 218, 85)');
    expect(style.borderRadius).toBe('12px');
    expect(style.boxShadow).toBe('rgba(0, 0, 0, 0.267) 0px 3px 0px 0px');
    expect(style.minHeight).toBe('52px');
    expect(getComputedStyle(link.querySelector('i')!).transform).toBe('none');
    expect(getComputedStyle(link.querySelector('i')!).transitionDuration).toBe('0s');
  });
});
