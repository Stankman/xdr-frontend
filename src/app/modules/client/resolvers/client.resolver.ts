import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { ClientService } from "../services/client.service";

@Injectable({ providedIn: 'root'})
export class ClientResolver {
    constructor(
        private readonly clientService : ClientService
    ) {}

    resolve(route : ActivatedRouteSnapshot, state: RouterStateSnapshot): void {
        if(!this.clientService.clientOpened) {
            this.clientService.clientOpened = true;
        }
    }
}