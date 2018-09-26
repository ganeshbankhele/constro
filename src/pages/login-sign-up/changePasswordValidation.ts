import {AbstractControl} from '@angular/forms';
export class changePasswordValidation {

    static MatchPassword(AC: AbstractControl) {
        let confirmPassword = AC.get('chcpassword').value; // to get value in input tag
        if(confirmPassword!='')
        {
            let password = AC.get('chpassword').value; // to get value in input tag
              if(password != confirmPassword) {
                    AC.get('chcpassword').setErrors( {MatchPassword: true} )
              } else {
                  return null
              }
        } 
      
    }
}