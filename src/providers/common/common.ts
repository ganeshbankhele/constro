import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonClass } from '../commonclass'

@Injectable()
export class CommonProvider {
  mainUrl="";
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }
  
  privacypolicy() {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.get(this.mainUrl+"Common/getPrivacy",{ headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  termsOfUse() {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.get(this.mainUrl+"Common/termsOfUse",{ headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  aboutUs() {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.get(this.mainUrl+"Common/aboutUs",{ headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  deleteImage(postParams) {
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

  companyDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"ProductDetails/getProductDetailsData", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getSimilarSellers(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"ProductDetails/getSimilarSellers", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  companyDetailsMyShop(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"CompanyDetails/getCompanyDetails", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  
  sellerDetailsMyShop(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"CompanyDetails/getSellerProducts", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  addBasicDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Catalog/addBasicDetails", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  // ionViewCanLeave(): Promise<boolean> {
  //   // apply only when going backward
  //   if (this.moveBack) {
  //     return new Promise((resolve: any, reject: any) => {
  //       let alert = this.alertCtrl.create({
  //         title: 'Warning',
  //         message: 'Are you sure you want to leave this page? All changes made will be discarded.'
  //       });
  //       alert.addButton({
  //         text: 'Stay',
  //         handler: () => {
  //           reject();
  //         }
  //       });
  //       alert.addButton({
  //         text: 'Leave',
  //         role: 'cancel',
  //         handler: () => {
  //           //clear temp area for saving of return
  //           this.SaveReturnService.clear();
  //           resolve();
  //         }
  //       });
  //       alert.present();
  //     });
  //   }
  // }
}
