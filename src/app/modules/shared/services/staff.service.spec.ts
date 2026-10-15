import { of } from 'rxjs';
import { ApiService } from './api.service';
import { StaffService } from './staff.service';
import { Api } from '../../core/models/api/api.model';
import { StaffGroup } from '../../core/models/staff/staff-group.model';

describe('StaffService', () => {
  it('loads the public staff directory', () => {
    const groups: StaffGroup[] = [{ name: 'admin', displayName: 'Administrator', weight: 100, members: [] }];
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['get']);
    api.get.and.returnValue(of(Object.assign(new Api<StaffGroup[]>(), { data: groups })));
    let result: StaffGroup[] = [];

    new StaffService(api).getStaffGroups().subscribe(value => result = value);

    expect(api.get).toHaveBeenCalledWith('staff');
    expect(result).toBe(groups);
  });
});
