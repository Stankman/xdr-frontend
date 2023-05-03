import { Injectable } from "@angular/core";
import { ErrorEntry } from "../models/error/error-entry.interface";
import { ErrorHandler } from "../interfaces/error-handler.interface";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private errorHandlers: ErrorEntry[]

    /**
     * Handle error based on the code
     *
     * @param code
     * @returns boolean
    */
    public handleError(code : number) : void {
        const handler: ErrorHandler = this.errorHandlers.filter(value => value.code === code)[0]?.class;

        if (!handler) {
          
        }
    
        handler.handle();
    }
}