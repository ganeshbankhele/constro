import { AbstractControl } from '@angular/forms';
export class GstValidator {
    static MatchGST(AC: AbstractControl) {
        var GST_No = AC.get('userGSTNumber').value.trim();
       // var statecode = AC.get('userStateNo').value.trim();
        if (GST_No != '') {
            let statecodes = ["35", "37", "12", "18", "10", "04", "22", "26", "25", "07", "30", "24", "06", "02", "01", "20", "29", "32", "31", "23", "27", "14", "17", "15", "13", "21", "97", "34", "03", "08", "11", "33", "36", "16", "09", "05", "19"];
            let panfourthcar = ["P", "F", "C", "H", "A", "T", "G", "L", "J", "G"];
            let getfirsttwochar = GST_No.substring(0, 2);
            let is_statecode_valid = statecodes.indexOf(getfirsttwochar);
            let getstartfromthirdtofifth = GST_No.substring(2, 5);
            let allalphabets = /^[A-Za-z]+$/;
            let getthirdtofifth = GST_No.substring(2, 5);
            let getsixthchar = GST_No.substring(5, 6);
            let getseventhchar = GST_No.substring(6, 7);
            let geteighttoele = GST_No.substring(7, 11);
            let is_category_valid = panfourthcar.indexOf(getsixthchar);
            if (GST_No.length < 15 || GST_No.length > 15) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            }
            // if (statecode != '') {
            //     if (statecode != getfirsttwochar) {
            //        AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            //     }
            // }
            if ((isNaN(getfirsttwochar))) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            }
              if (is_statecode_valid < 0) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
              }
            if (!(getstartfromthirdtofifth.match(allalphabets))) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            }
            if (is_category_valid < 0) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            }
            if (!(getseventhchar.match(allalphabets))) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            }
            if ((isNaN(geteighttoele))) {
               AC.get('userGSTNumber').setErrors( {MatchGST: true} )
            }
        }
        else {
            return null;
        }

    }
}
