import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { AlertsComponent } from './alerts.component';

describe('AlertsComponent', () => {
  let fixture: ComponentFixture<AlertsComponent>;
  let messages: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertsComponent, NoopAnimationsModule, TranslateModule.forRoot()],
      providers: [MessageService]
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      COMMON: { CLOSE: 'Close' },
      ALERTS: { TITLE: { SUCCESS: 'Great news!', INFO: 'Hotel notice', WARN: 'Heads up!', ERROR: 'Oops!' } }
    });
    translate.use('en');

    messages = TestBed.inject(MessageService);
    fixture = TestBed.createComponent(AlertsComponent);
    fixture.detectChanges();
  });

  const alert = (): HTMLElement | null => fixture.nativeElement.querySelector('.habbo-alert');

  it('normalizes unknown severities to info', () => {
    const component = fixture.componentInstance;
    expect(component.tone({ severity: 'secondary' })).toBe('info');
    expect(component.tone({ severity: 'error' })).toBe('error');
    expect(component.tone(undefined)).toBe('info');
  });

  it('uses the selected Frank GIF for error and non-error alerts', () => {
    const component = fixture.componentInstance;
    expect(component.mascot('error')).toBe('/assets/resources/images/frank_4.gif');
    expect(component.mascot('success')).toBe('/assets/resources/images/frank_2.gif');
    expect(component.mascot('info')).toBe('/assets/resources/images/frank_2.gif');
    expect(component.mascot('warn')).toBe('/assets/resources/images/frank_2.gif');
  });

  it('renders a Habbo-style alert window with a translated title', fakeAsync(() => {
    messages.add({ severity: 'error', summary: 'Wrong password', detail: 'Try again' });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const element = alert()!;
    expect(element.getAttribute('data-tone')).toBe('error');
    expect(element.querySelector('.habbo-alert-title')?.textContent?.trim()).toBe('Oops!');
    expect(element.querySelector('.habbo-alert-text strong')?.textContent?.trim()).toBe('Wrong password');
    expect(element.querySelector('.habbo-alert-text p')?.textContent?.trim()).toBe('Try again');
    expect(element.querySelector('.habbo-alert-timer')).not.toBeNull();

    messages.clear();
    fixture.detectChanges();
    tick(1000);
  }));

  it('hides the countdown for sticky alerts and closes from the close button', fakeAsync(() => {
    messages.add({ severity: 'success', summary: 'Saved', sticky: true });
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(alert()?.querySelector('.habbo-alert-title')?.textContent?.trim()).toBe('Great news!');
    expect(alert()?.querySelector('.habbo-alert-timer')).toBeNull();

    const close = alert()!.querySelector<HTMLButtonElement>('.habbo-alert-close')!;
    expect(close.getAttribute('aria-label')).toBe('Close');
    close.click();
    fixture.detectChanges();
    tick(1000);
    fixture.detectChanges();

    expect(alert()).toBeNull();
  }));
});
