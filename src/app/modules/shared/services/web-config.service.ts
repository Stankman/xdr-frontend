import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { Observable, map } from "rxjs";
import { Api } from "../../core/models/api/api.model";

@Injectable({
    providedIn: 'root'
})
export class WebConfigService {
    constructor(private apiService : ApiService) {}

    /**
     * @param key
     * @return Promise<any>
    */
    public async get(key : string) : Promise<any> {
        return this.apiService.get(`config/get`, key).pipe(
            map((value) => value.data)
        );
    }

    /**
     * @param key
     * @param value
     * @return Promise<API>
    */
    public async set(key : string, value : string | number) : Promise<any> {
        return this.apiService.post(`config/get`, { key, value }).pipe(
            map((value) => value.data)
        );
    }
}