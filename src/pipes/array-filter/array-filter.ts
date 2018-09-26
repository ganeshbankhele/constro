import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "filterStatus",
  pure: false
})
export class ArrayFilterPipe implements PipeTransform {
  transform(items: Array<any>, conditions: { [field: string]: any }): Array<any> {
    return items.filter(item => {
     // console.log(conditions);
      for (let field in conditions) {
        if (item[field] !== conditions[field]) {
        //  console.log(conditions[field]);
          return false;
        }
      }
     // console.log(items);
      return true;
    });
  }
}