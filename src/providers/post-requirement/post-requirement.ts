import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonClass } from '../commonclass'


@Injectable()
export class  PostRequirementProvider{
  data: any;
  mainUrl=""
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }

  postRequirement(value) {
    const url = this.mainUrl+"PostRequirement/postYourRequirementApp";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
     return new Promise(resolve => {
      return this.http.post(url, JSON.stringify(value), { headers: headers }).subscribe(data => {
        this.data = data;
        resolve(this.data);
      }, err => {
        console.log(err);
      });
    });
  }

  postRequirementUnits(value) {
    const url = this.mainUrl+"PostRequirement/getProductsUnits";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
     return new Promise(resolve => {
      return this.http.post(url, JSON.stringify(value), { headers: headers }).subscribe(data => {
        this.data = data;
        resolve(this.data);
      }, err => {
        console.log(err);
      });
    });
  }
}
