import { Component, ChangeDetectionStrategy, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from 'src/environments/environment';
import { StaffGroup, StaffMember } from '../../../core/models/staff/staff-group.model';
import { StaffService } from '../../../shared/services/staff.service';
import { LookService } from '../../../shared/services/look.service';
import { LookGestures } from '../../../core/models/look/look-gestures.model';
import { LookSizes } from '../../../core/models/look/look-sizes.model';
import { LookActions } from '../../../core/models/look/look-actions.model';

@Component({
    selector: 'xdr-team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TeamComponent implements OnInit {
  private readonly staffService = inject(StaffService);
  private readonly lookService = inject(LookService);
  private readonly destroyRef = inject(DestroyRef);

  public readonly hotelName = environment.app.hotelName;
  public groups: StaffGroup[] = [];
  public loading = true;
  public failed = false;

  ngOnInit(): void {
    this.load();
  }

  public load(): void {
    this.loading = true;
    this.failed = false;
    this.staffService.getStaffGroups()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (groups) => {
          this.groups = groups;
          this.loading = false;
        },
        error: () => {
          this.groups = [];
          this.failed = true;
          this.loading = false;
        }
      });
  }

  public figure(member: StaffMember, wave = false): string {
    return this.lookService.get({
      look: member.look,
      size: LookSizes.DEFAULT,
      gesture: LookGestures.SMILE,
      action: wave ? LookActions.WAVE : LookActions.DEFAULT
    });
  }

  public onlineCount(group: StaffGroup): number {
    return group.members.filter((member) => member.online).length;
  }
}
