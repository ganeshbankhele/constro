import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonClass } from '../commonclass'

@Injectable()
export class ProfileProvider {
  all: any;
  responseobj: any;
  basicDetails: any;
  bankDetails: any;
  compDetails: any;
  awardsPhotos: any;
  membershipPhotos: any;
  
  companyLogo = ''; businessReadiness;
  mainUrl="";
  constructor(public http: HttpClient,public com:CommonClass,
  ) {
    this.mainUrl = this.com.url;
  }
  loadProfile(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl+"Profile/getuserprofile", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.all = data;
        if (this.all.response.status == 'Success') {
          this.responseobj = this.all.response.responseObject;
          this.companyLogo = this.responseobj.Company_Logo;

          this.businessReadiness = this.responseobj.Business_Readiness;
          this.basicDetails = {
            "emailId": this.responseobj.Email_Id,
            "mobileNo": this.responseobj.Phone_No,
            "fName": this.responseobj.First_Name,
            "companyFullName": this.responseobj.Company_Full_Name,
            "DOB":this.responseobj.DOB,
           // "mName": this.responseobj.Middle_Name,
          //  "lName": this.responseobj.Last_Name,
           // "isComp": this.responseobj.Is_Indivisual_Buyer,
          }

          this.bankDetails = {
            "bankName": this.responseobj.Bank_Name,
            "bankIFSCCode": this.responseobj.Bank_IFSC_Code,
            "bankAccountNo": this.responseobj.Bank_Account_No,
            "ccUrl": this.responseobj.Cancelled_Cheque_Scanned_Copy,
          }

          this.awardsPhotos ={
            "awardsPhotos": this.responseobj.Awards_Photos,
            "membershipPhotos": this.responseobj.Membership_Photos,
          }

          this.membershipPhotos ={
             "trademark": this.responseobj.Trademark_Photos,
             "brochures": this.responseobj.Brochures_Photos,
             "trademarkPdf": this.responseobj.Trademark_PDFs,
             "brochuresPdf": this.responseobj.Brochures_PDFs,
             
          }
          

          this.compDetails = {
            "companyShortName": this.responseobj.Company_Short_Name,
            "companyFullName": this.responseobj.Company_Full_Name,
            "companyDescription": this.responseobj.Company_Description,
            "companyAddress": this.responseobj.Company_Address,
            "companyLocation": this.responseobj.Company_Location,
            "companyContactPersonName": this.responseobj.Company_Contact_Person_Name,
            "companyContactPersonEmail": this.responseobj.Company_Contact_Person_Email,
            "companyContactPersonNumber": this.responseobj.Company_Contact_Person_Number,
            "website": this.responseobj.Website,
            "videoLink": this.responseobj.Video_Link,
            "gstNumber": this.responseobj.GST_Number,
            "panNo": this.responseobj.PAN_No,
            "tinNo": this.responseobj.TIN_No,
            "panScannedCopy": this.responseobj.PAN_Scanned_Copy,
            "gstScannedCopy": this.responseobj.GST_Scanned_Copy,
            "tinScannedCopy": this.responseobj.TIN_Scanned_Copy,
            "cstScannedCopy": this.responseobj.CST_Scanned_Copy,
            "Company_Logo": this.responseobj.Company_Logo,
            "trademarkPhotos": this.responseobj.Trademark_Photos,
            "CompanyPhotos": this.responseobj.Company_Photos
          }
        }
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  basicDetailsUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/updatebasicprofile_app";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  companyDetailsUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/updatecompanydetails_app";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  gstUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/updategst_app";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  panUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/updatepan_app";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  tinUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/updatetin_app";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  bankUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/updatebank_app";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  descriptionUpdate(postParams) {
    const search_loc = this.mainUrl+"Profile/awardsmembershipDesc";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_loc, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        let details:any = data;
        resolve(details);
     }, err => {
        console.log(err);
      });
    });
  }

  



}
