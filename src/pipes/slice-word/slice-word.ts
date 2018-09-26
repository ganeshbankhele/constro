
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sliceWord',
})
export class SliceWordPipe implements PipeTransform {
  transform(value: any, noofcharacters?: number): any {
    let string = '';
    if(typeof value != 'undefined'){
      if(value.length>noofcharacters)
      {
        string=value.substring(0,noofcharacters)+"...";
      }  
      else{
        string=value;
      }  
    }
   
    return string;
  }
}
