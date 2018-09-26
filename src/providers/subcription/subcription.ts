import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonClass } from '../commonclass'

@Injectable()
export class SubcriptionProvider {
  mainUrl="http://testing.constrobazaar.com/nodeApi/";
  data:any;
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }

 mySubscription(postParams) {
    const search_loc = this.mainUrl+"Packages/getMySubscription";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status === 'Success') {
          this.data = this.data.response.responseObject;
         resolve(this.data);
        }
     }, err => {
        console.log(err);
      });
    });
  }

  getPackageList(postParams) {
    const search_loc = this.mainUrl+"Packages/getPackages";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status === 'Success') {
          this.data = this.data.response.responseObject.packageDetails;
         resolve(this.data);
        }
     }, err => {
        console.log(err);
      });
    });
  }

  getSinglePackage(postParams) {
    const search_loc = this.mainUrl+"Packages/getSinglePackage";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
         resolve(this.data);
       
     }, err => {
        console.log(err);
      });
    });
  }

  submitPackageDetails(postParams) {
    const search_loc = this.mainUrl+"Packages/submitPackageDetails";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
         resolve(this.data);
       
     }, err => {
        console.log(err);
      });
    });
  }

  submitPaymentDetails(PostParameter) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + 'Packages/submitPaymentDetails', JSON.stringify(PostParameter), { headers: headers }).subscribe(data => {        
        resolve(data);
      }, err => {
        
      });
    });
  }
  
}
