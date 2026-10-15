import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LegalComponent } from './legal.component';
import { environment } from 'src/environments/environment';

describe('Legal pages', () => {
  it('updates the document and sections when route data changes', () => {
    const data = new BehaviorSubject({ legalPage: 'terms' });
    TestBed.configureTestingModule({ providers: [
      { provide: ActivatedRoute, useValue: { data: data.asObservable() } }
    ] });
    const component = TestBed.runInInjectionContext(() => new LegalComponent());
    expect(component.hotelName).toBe(environment.app.hotelName);
    expect(component.translationKey).toBe('LEGAL.TERMS');
    expect(component.sections).toContain('ACCOUNT');
    data.next({ legalPage: 'privacy' });
    expect(component.translationKey).toBe('LEGAL.PRIVACY');
    expect(component.sections).toContain('RIGHTS');
    data.next({ legalPage: 'cookies' });
    expect(component.translationKey).toBe('LEGAL.COOKIES');
    expect(component.sections).toContain('STORAGE');
    expect(component.sections.length).toBe(5);
    TestBed.resetTestingModule();
    data.next({ legalPage: 'terms' });
    expect(component.page).toBe('cookies');
  });
});
