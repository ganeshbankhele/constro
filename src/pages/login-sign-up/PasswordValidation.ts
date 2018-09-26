import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let confirmPassword = AC.get('signUpcPassword').value;
        if(confirmPassword!=''){
            let password = AC.get('signUpPassword').value; // to get value in input tag
           
             if(password != confirmPassword) {
                   AC.get('signUpcPassword').setErrors( {MatchPassword: true} )
             } else {
                 return null
             }
        } else {
            return null
        }
       
    }
}