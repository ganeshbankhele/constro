import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'appliedFilter',
})
export class AppliedFilterPipe implements PipeTransform {
  transform(val: any) {
   let res = val.split(",");
   let sell = res.length -1 ;
   let final="";
   let count =0;
   res.forEach((element) => {
     if(count==0){
       if(element.length > 25){
        final = element.substring(0,25) + "...";
       }else{
        final = element;
       }
      
     }else{
      final = element + " & "+ sell + " more" ;
     }
     count++;
   });
   return final;
  }
}
