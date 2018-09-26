import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Platform} from 'ionic-angular/index';
import { CommonClass } from '../commonclass'

@Injectable()
export class BuyLeadProvider {
  data:any;
 
  mainUrl="";  
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
   this.mainUrl = com.url;
  }

 

  buyLeads(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"BuyLead/getBuyLeads", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status === 'Success') {
          this.data = this.data.response.responseObject.BuyLeadData;
         resolve(this.data);
        }
      }, err => {
        console.log(err);
      });
    });
  }
  getPurchasedLeads(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"BuyLead/getPurchaseLeads", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        if (this.data.response.status === 'Success') {
          this.data = this.data.response.responseObject.PurchaseLeadData;
         resolve(this.data);
        }
      }, err => {
        console.log(err);
      });
    });
  }


  getUserDetailsForPayment(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"BuyLead/getUserDetailsForPayment", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
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

  getUserPayment(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"BuyLead/submitLeadDetails", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.data = data;
        resolve(this.data);
       
      }, err => {
        console.log(err);
      });
    });
  }

  submitLeadPaymentDetails(PostParameter) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + 'Packages/submitLeadPaymentDetails', JSON.stringify(PostParameter), { headers: headers }).subscribe(data => {   
        resolve(data);
      }, err => {
        
      });
    });
  }

  
  
}
