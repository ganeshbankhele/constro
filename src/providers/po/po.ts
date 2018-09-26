import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import { CommonClass } from '../commonclass'

@Injectable()
export class PoProvider {
  userId:string;
  data:any=[];
  mainUrl="";
   constructor(public http: HttpClient,public com:CommonClass,
   ) {
    this.mainUrl = this.com.url;
  }

  poheader(postParams) {
    const search_loc = this.mainUrl+"Order/poHeader";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
        this.data = data;
        resolve(this.data);
     }, err => {
        console.log(err);
      });
    });
  }

  
  poSellerheader(postParams) {
    const search_loc = this.mainUrl+"Order/poHeaderSeller";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
        this.data = data;
          this.data = this.data.response.responseObject.orderResults;
         resolve(this.data);
     }, err => {
        console.log(err);
      });
    });
  }


  poDetails(postParams) {
    const search_loc = this.mainUrl+"Order/poDetails";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
   
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
        this.data = data;
         this.data = this.data.response.responseObject.orderDetailsResults[0];
         resolve(this.data);
     }, err => {
        console.log(err);
      });
    });
  }

  submitOA(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Order/submitOA", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
