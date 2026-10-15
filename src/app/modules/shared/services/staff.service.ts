import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { ApiService } from "./api.service";
import { StaffGroup } from "../../core/models/staff/staff-group.model";

@Injectable({
    providedIn: 'root'
})
export class StaffService {
    constructor(
        private readonly apiService : ApiService
    ) {}

    public getStaffGroups() : Observable<StaffGroup[]> {
        return this.apiService.get<StaffGroup[]>('staff').pipe(
            map((resp) => resp.data ?? [])
        );
    }
}
