import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonClass } from '../commonclass'

@Injectable()
export class DashboardProvider {
  mainUrl="";
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }
  
  loadBuyerDashobard(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Dashboard/getdashboard", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadSellerDashobard(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Dashboard/getdashboard", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
}
