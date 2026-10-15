import { CanActivateChildFn, CanActivateFn, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "primeng/api";
import { AccountService } from "../modules/shared/services/account.service";
import { Injectable, inject } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class UnauthenticatedGuard {
    constructor(
        private readonly router : Router,
        private readonly accountService : AccountService,
        private readonly messageService : MessageService,
        private readonly translateService : TranslateService
    ) {}

    public canActivate() : boolean {
        if(!this.accountService.token || !this.accountService.account) {
            this.router.navigateByUrl('/');
            this.messageService.add({ 
                severity: 'error', 
                summary: this.translateService.instant('ERROR.UNAUTHENTICATED.SUMMARY'), 
                detail: this.translateService.instant('ERROR.UNAUTHENTICATED.DETAIL')
            });
            return false;
        }
        if (!this.accountService.account.activeAvatar) {
            this.router.navigateByUrl('/articles');
            this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('ERROR.AVATAR_REQUIRED')
            });
            return false;
        }

        return true;
    }
}

export const unauthenticatedAccess : CanActivateFn = () => {
    return inject(UnauthenticatedGuard).canActivate();
}

export const unauthenticatedChildAccess : CanActivateChildFn = () => {
    return inject(UnauthenticatedGuard).canActivate();
}