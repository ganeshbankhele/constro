import { Injectable } from '@angular/core';
@Injectable()
export class CommonClass {
    url = '';
    constructor() {
       this.url = 'https://www.constrobazaar.com/sandbox/';
      // this.url = 'https://www.constrobazaar.com/api/';
    }
}