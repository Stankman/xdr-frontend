import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AccountService } from "../modules/shared/services/account.service";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private readonly accountService : AccountService
    ) {}

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        if(this.accountService.token) {
            req.headers.append('Authorization', `Bearer ${ this.accountService.token }`);
        }
        
        return next.handle(req);
    }
}