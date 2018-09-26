import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonClass } from '../commonclass'

@Injectable()
export class GetSearchQuoteProvider {
  mainUrl;
  data:any=[];
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }

  getQuoteDetails(postParams) {
    const search_loc = this.mainUrl+"GetQuote/getquotedata";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        // if (this.data.response.status === 'Success') {
        //   this.data = this.data.response.responseObject;
          resolve(this.data);
       // }
     }, err => {
        console.log(err);
      });
    });
  }

  getQuoteSend(postParams) {
    const search_loc = this.mainUrl+"GetQuote/getquoteSend";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
   
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status === 'Success') {
          resolve(this.data);
        }
     }, err => {
        console.log(err);
      });
    });
  }
}