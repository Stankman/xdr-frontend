import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function matchValidator(matchTo : string, reverse? : boolean) : ValidatorFn {

    let validator : ValidatorFn = (control : AbstractControl) => {
        if(control.parent) {
            let matchToControl : AbstractControl = control.parent.controls[matchTo];

            if(reverse) {
                if(matchToControl) {
                    matchToControl.updateValueAndValidity();
                }
                return null;
            } else {
                if(matchToControl.value === control.value) {
                    return null
                }
            }
        }
        
        return { notMatching: true };
    }

    return validator;
}