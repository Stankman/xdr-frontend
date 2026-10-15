import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { ClientService } from 'src/app/modules/client/services/client.service';
import { ClientNitroComponent } from './client-nitro.component';

describe('Nitro lifecycle', () => {
  let opened: BehaviorSubject<boolean>;
  let client: jasmine.SpyObj<ClientService>;
  let component: ClientNitroComponent;
  beforeEach(() => {
    opened = new BehaviorSubject(false);
    client = jasmine.createSpyObj('ClientService', ['ticket'], { clientOpenedObservable: opened.asObservable() });
    client.ticket.and.returnValue(of('ticket + special'));
    TestBed.configureTestingModule({});
    component = TestBed.runInInjectionContext(() => new ClientNitroComponent(
      client, TestBed.inject(DomSanitizer), jasmine.createSpyObj<TranslateService>('TranslateService', ['instant'])
    ));
    component.ngOnInit();
  });

  it('requests one ticket and keeps a single source across reopen', () => {
    opened.next(true);
    const source = component.source;
    expect(source).not.toBeNull();
    expect(String(source)).toContain('ticket+%2B+special');
    opened.next(false);
    opened.next(true);
    expect(client.ticket).toHaveBeenCalledTimes(1);
    expect(component.source).toBe(source);
  });

  it('recovers loading on ticket failure and permits another attempt', () => {
    client.ticket.and.returnValue(throwError(() => new Error('Unavailable')));
    opened.next(true);
    expect(component.failed).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.source).toBeNull();
    client.ticket.and.returnValue(of('retry-ticket'));
    opened.next(false);
    opened.next(true);
    expect(component.failed).toBeFalse();
    expect(component.source).not.toBeNull();
  });

  it('unsubscribes when its owner is destroyed', () => {
    TestBed.resetTestingModule();
    opened.next(true);
    expect(client.ticket).not.toHaveBeenCalled();
  });
});
