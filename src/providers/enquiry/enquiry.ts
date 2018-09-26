import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonClass } from '../commonclass'

@Injectable()
export class EnquiryProvider {
  mainUrl="";
  data:any=[];
  leadd:any;
  leads:any;
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }

  getEnquiry(postParams) {
    const search_loc = this.mainUrl+"LeadEnquiry/getMyLead";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status === 'Success') {
          this.leads = this.data.response.responseObject.leadData;
          resolve(this.leads);
        }
     }, err => {
        console.log(err);
      });
    });
  }

  
}
