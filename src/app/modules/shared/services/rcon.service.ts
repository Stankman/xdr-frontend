import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { Rcon } from "../../core/models/misc/rcon.model";
import { Api } from "../../core/models/api/api.model";

@Injectable({providedIn: 'root'})
export class RconService {
    constructor(
        private readonly apiService : ApiService
    ) {}

    public execute(rconCommand : Rcon) : Observable<any> {
        return this.apiService.post(`rcon/execute`, rconCommand).pipe(
            map((resp : Api) => resp.data)
        );
    }
}