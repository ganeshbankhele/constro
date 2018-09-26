import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonClass } from '../commonclass'

@Injectable()
export class ProductCatelogProvider {
  
  url: string;
  constructor(private http: HttpClient,public com:CommonClass,
  ) {
    this.url = this.com.url;
    
  }

  getProServices(PostParameter) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.url + 'Catalog/getProServices', JSON.stringify(PostParameter), { headers: headers }).subscribe(data => {
             resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  updateProServicesStatus(PostParameter) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.url + 'Catalog/updateProServicesStatus', JSON.stringify(PostParameter), { headers: headers }).subscribe(data => {        
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
