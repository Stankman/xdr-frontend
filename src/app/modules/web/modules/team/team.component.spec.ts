import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, of, throwError } from 'rxjs';
import { TeamComponent } from './team.component';
import { StaffService } from '../../../shared/services/staff.service';
import { StaffGroup } from '../../../core/models/staff/staff-group.model';

describe('TeamComponent', () => {
  let staffService: jasmine.SpyObj<StaffService>;
  let fixture: ComponentFixture<TeamComponent>;

  const groups: StaffGroup[] = [
    {
      name: 'admin',
      displayName: 'Administrator',
      weight: 100,
      members: [
        { username: 'Frank', look: 'hd-180-1', motto: 'Welcome!', online: true },
        { username: 'Mia', look: 'hd-600-1', motto: '', online: false },
      ],
    },
    { name: 'content_editor', displayName: 'Content Editor', weight: 50, members: [] },
  ];

  const create = () => {
    fixture = TestBed.createComponent(TeamComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  };

  beforeEach(async () => {
    staffService = jasmine.createSpyObj<StaffService>('StaffService', ['getStaffGroups']);
    await TestBed.configureTestingModule({
      declarations: [TeamComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: StaffService, useValue: staffService }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('renders a section per staff group with its members', () => {
    staffService.getStaffGroups.and.returnValue(of(groups));
    const element = create();

    const sections = element.querySelectorAll('.staff-group');
    expect(sections.length).toBe(2);
    expect(sections[0].querySelector('.staff-group-title')?.textContent).toContain('Administrator');
    const members = sections[0].querySelectorAll('.staff-member');
    expect(members.length).toBe(2);
    expect(members[0].classList).toContain('is-online');
    expect(members[1].classList).not.toContain('is-online');
    expect(members[0].querySelector('img')?.getAttribute('src')).toContain('hd-180-1');
    expect(sections[1].querySelector('.staff-group-empty')).not.toBeNull();
    expect(fixture.componentInstance.onlineCount(groups[0])).toBe(1);
  });

  it('shows skeletons while loading', () => {
    staffService.getStaffGroups.and.returnValue(new Subject<StaffGroup[]>());
    const element = create();
    expect(element.querySelectorAll('.staff-member.is-skeleton').length).toBe(3);
  });

  it('shows the empty block when there are no groups', () => {
    staffService.getStaffGroups.and.returnValue(of([]));
    expect(create().querySelector('xdr-empty-block')).not.toBeNull();
  });

  it('shows an error state and retries', () => {
    staffService.getStaffGroups.and.returnValue(throwError(() => new Error('down')));
    const element = create();
    expect(element.querySelector('.staff-state p-button')).not.toBeNull();

    staffService.getStaffGroups.and.returnValue(of(groups));
    fixture.componentInstance.load();
    fixture.detectChanges();
    expect(element.querySelectorAll('.staff-group').length).toBe(2);
    expect(staffService.getStaffGroups).toHaveBeenCalledTimes(2);
  });
});
