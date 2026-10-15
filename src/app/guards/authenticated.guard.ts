import { Injectable, inject } from "@angular/core";
import { Router, CanActivateFn, CanActivateChildFn } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { AccountService } from "../modules/shared/services/account.service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticatedGuard {
    constructor(
        private readonly router : Router,
        private readonly accountService : AccountService
    ) {}

    public canActivate() : boolean {
        if(this.accountService.token) {
            this.router.navigateByUrl(this.accountService.account?.activeAvatar ? '/me' : '/articles');
            return false;
        }

        return true;
    }
}

export const authenticatedAccess : CanActivateFn = () => {
    return inject(AuthenticatedGuard).canActivate();
}

export const authenticatedChildAccess : CanActivateChildFn = () => {
    return inject(AuthenticatedGuard).canActivate();
}