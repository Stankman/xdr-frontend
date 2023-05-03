import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, map, throwError } from "rxjs";
import { ErrorService } from "../modules/core/services/error.service";
import { environment } from "src/environments/environment";
import { ErrorResponse } from "../modules/core/models/error/error-response.interface";

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
    constructor(private errorService: ErrorService) {}
    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            map(res => {
              if(this.handleError(res))
                return;
      
              return res;
            }),
            catchError(err => {
              if(this.handleError(err))
                return;
      
              return throwError(() => new Error(err));
            })
          );
    }

    private handleError(response : HttpErrorResponse | HttpEvent<any>) : boolean {
        if ((response instanceof HttpResponse || response instanceof HttpErrorResponse) && response.url.includes(environment.app.endpoint)) {
          
          let body : ErrorResponse;
          
          if(response instanceof HttpErrorResponse)
            body = response.error;
          else if(response instanceof HttpResponse)
            body = response.body;
    
          if(body.status === 'error')
          {
            this.errorService.handleError(body.code);
            return true;
          }
        }
    
        return false;
      }
}