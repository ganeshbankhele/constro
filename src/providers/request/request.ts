import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/timeout';
import { CommonClass } from '../commonclass'

@Injectable()
export class RequestProvider {
  

  mainUrl="";
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }

  loadBuyerRequest(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getBuyerRequest", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
          resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  
  loadSellerRequest(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getSellerRequest", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
          resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadBuyerRequestDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getBuyerRequestDetails", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
       resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  loadSellerRequestDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getSellerRequestDetails", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  loadBuyerRequestHistory(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getBuyerRequestHistory", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
             resolve(data);
     }, err => {
        console.log(err);
      });
    });
  }

  loadSellerResponseQuote(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getSellerResponseQuoteDetails", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
          resolve(data)
      }, err => {
        console.log(err);
      });
    });
  }


  setResponseAndRevise(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/setResponseAndRevise", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
          resolve(data);
        }, err => {
        console.log(err);
      });
    });
  }

  buyerReviseGetDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getDetailsRevisedQuote", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
       resolve(data);
     }, err => {
        console.log(err);
      });
    });
  }

  
  sendBuyerRevise(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/sendRevisedQuote", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
       resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getOrderDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/getOrderDetails", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
            resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  placePo(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Request/placePo", JSON.stringify(postParams), { headers: headers }).timeout(60000).subscribe(data => {
           resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
 
}


