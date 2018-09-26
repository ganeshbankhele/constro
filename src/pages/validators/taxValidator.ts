// import { AbstractControl, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
// export class TaxValidator {
//     static validTax(AC: AbstractControl) {
//         var taxApplied = <FormControl>AC.get('taxApplied');
//         //console.log(taxApplied);

//         var taxNames = <FormArray>AC.get('taxes');

//         function isBigEnough(element, index, array) {
//             console.log(element.get('taxName').value);
//             if (element.get('taxName').value != '') {

//                 // taxApplied.setValidators([Validators.required]);
//                 element.get('taxPersontage').setValidators([Validators.required])
//             }
//             //  taxApplied.get('taxApplied').updateValueAndValidity();
//             element.get('taxPersontage').updateValueAndValidity();
//             //console.log(taxNames.controls.indexOf(control)) // logs index of changed item in form array

//         }

//         if (1) {
//             return {
//                 validCountryPhone: true
//             };
//         }
//         else {
//             return taxNames;
//         }

//     }
// }
