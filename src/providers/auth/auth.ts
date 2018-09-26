import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
//import { CookieService } from 'ngx-cookie-service';
import { Platform } from 'ionic-angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { CommonClass } from '../commonclass'

@Injectable()
export class AuthProvider {
  public appVersion = 216;
  public finalDetails: any = [];
  public userId: string = '';
  public userName: string = '';
  public userType: string = '';
  public userImage: string = '';
  public phoneNo: string = '';
  public emailId: string = '';
  public firstLastName: string = '';
  public isCompanyDetailsvailabel= '';
  public isUserDetailsvailabel= '';
  sessions: any = [];
  companyName: string = '';
  userNameFull: string = '';
  checkEmailId: boolean = false;
  //dataSession = { emailId: "", phoneNo: "", userType: "" };
  data: any;
  loginAs:string ="";
  all: any; responseObj: any;
  havingBuyerAccount: string = '';
  havingSellerAccount: string = '';
  readyToLogin: boolean;
  mainUrl = "";
  constructor(public http: HttpClient,public com:CommonClass,
    //  private sqlite: SQLite,
    private secureStorage: SecureStorage,
    //  private cookieService: CookieService,
    public platform: Platform,
    public events: Events) {
    this.mainUrl = this.com.url;
    this.readyToLogin = false;
    
  }

  // callSession(){
  //   this.getSession();
  //   if(this.dataSession.emailId!=''){
  //     let parameters = {
  //       "phoneNo": this.sessions.phoneNo,
  //       "emailId": this.sessions.emailId,
  //       "userType": this.sessions.userType,
  //       "requestFrom": "App",
  //       "token": ""
  //     };
  //     this.setUserDetails(parameters);
  //   }
  // }
  createNewAccount(PostParameter) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + 'Login/createNewAccount', JSON.stringify(PostParameter), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }



  setUserDetails(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/setUserDetails", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.all = data;
        if (this.all.response.status == "Success") {
          this.responseObj = this.all.response.responseObject;
          localStorage.setItem('userId', this.responseObj.userId);
          localStorage.setItem('phoneNo', this.responseObj.phoneNo);
          localStorage.setItem('emailId', this.responseObj.emailId);
          localStorage.setItem('userName', this.responseObj.userName);
          localStorage.setItem('userType', this.responseObj.userType);
          localStorage.setItem('subscriptionTypeId', this.responseObj.subscriptionTypeId);
          localStorage.setItem('status', this.responseObj.Status);
          localStorage.setItem('userImage', this.responseObj.userImage);
          localStorage.setItem('firstLastName', this.responseObj.firstLastName);
          localStorage.setItem('havingBuyerAccount', this.responseObj.havingBuyerAccount);
          localStorage.setItem('havingSellerAccount', this.responseObj.havingSellerAccount);
          this.userImage = localStorage.getItem('userImage');
          this.userName = localStorage.getItem('userName');
          this.firstLastName = localStorage.getItem('firstLastName');
          this.userType = localStorage.getItem('userType');
          this.userId = localStorage.getItem('userId');
          this.phoneNo = localStorage.getItem('phoneNo');
          this.emailId = localStorage.getItem('emailId');
          this.havingBuyerAccount = localStorage.getItem('havingBuyerAccount');
          this.havingSellerAccount = localStorage.getItem('havingSellerAccount');
          this.secureStorage.create('myDetails').then(
            (storage: SecureStorageObject) => {
              console.log('Storage is ready!');
              //securely store
              storage.set('loginInfo', JSON.stringify(
                {
                  userId: this.responseObj.userId,
                  userType: this.responseObj.userType,
                  phoneNo: this.responseObj.phoneNo,
                  emailId: this.responseObj.emailId,
                  userName: this.responseObj.userName,
                  subscriptionTypeId: this.responseObj.subscriptionTypeId,
                  status: this.responseObj.Status,
                  userImage: this.responseObj.userImage,
                  firstLastName: this.responseObj.firstLastName,
                  havingBuyerAccount: this.responseObj.havingBuyerAccount,
                  havingSellerAccount: this.responseObj.havingSellerAccount,
                  isCompanyDetailsvailabel: this.responseObj.userBasicDetails.isCompanyDetailsvailabel,
                  isUserDetailsvailabel: this.responseObj.userBasicDetails.isUserDetailsvailabel,
                  companyName: this.responseObj.userBasicDetails.companyName,
                  userNameFull: this.responseObj.userBasicDetails.userName,
                  
                }))
                .then(
                data => {
                  console.log('stored info');
                },
                error => console.log(error)
                );
              this.readyToLogin = true;
            },
            error => console.log(error)
          );

          // this.toast.show('Switched to '+this.responseObj.userType, '5000', 'bottom').subscribe(
          //   toast => {
          //     console.log(toast);
          //   }
          // );
        }
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  login(username, password, loginType) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      "userName": username,
      "password": password,
      "loginType": loginType,
      "LoginAs": this.loginAs,
      "requestFrom":"App"
    };
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/userLogin", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.all = data;
        if (this.all.response.status == "Success") {
          this.responseObj = this.all.response.responseObject;

          localStorage.setItem('userId', this.responseObj.userId);
          localStorage.setItem('phoneNo', this.responseObj.phoneNo);
          localStorage.setItem('emailId', this.responseObj.emailId);
          localStorage.setItem('userName', this.responseObj.userName);
          localStorage.setItem('userType', this.responseObj.userType);
          localStorage.setItem('subscriptionTypeId', this.responseObj.subscriptionTypeId);
          localStorage.setItem('status', this.responseObj.Status);
          localStorage.setItem('userImage', this.responseObj.userImage);
          localStorage.setItem('firstLastName', this.responseObj.firstLastName);
          localStorage.setItem('havingBuyerAccount', this.responseObj.havingBuyerAccount);
          localStorage.setItem('havingSellerAccount', this.responseObj.havingSellerAccount);
          localStorage.setItem('isCompanyDetailsvailabel', this.responseObj.userBasicDetails.isCompanyDetailsvailabel);
          localStorage.setItem('isUserDetailsvailabel', this.responseObj.userBasicDetails.isUserDetailsvailabel);
          localStorage.setItem('companyName', this.responseObj.userBasicDetails.companyName);
          localStorage.setItem('userNameFull', this.responseObj.userBasicDetails.userName);
          
          this.userImage = localStorage.getItem('userImage');
          this.userName = localStorage.getItem('userName');
          this.firstLastName = localStorage.getItem('firstLastName');
          this.userType = localStorage.getItem('userType');
          this.userId = localStorage.getItem('userId');
          this.phoneNo = localStorage.getItem('phoneNo');
          this.emailId = localStorage.getItem('emailId');
          this.havingBuyerAccount = localStorage.getItem('havingBuyerAccount');
          this.havingSellerAccount = localStorage.getItem('havingSellerAccount');
         this.isCompanyDetailsvailabel = localStorage.getItem('isCompanyDetailsvailabel');
         this.isUserDetailsvailabel = localStorage.getItem('isUserDetailsvailabel');
         this.companyName = localStorage.getItem('companyName');
         this.userNameFull = localStorage.getItem('userNameFull');
         
          this.secureStorage.create('myDetails').then(
            (storage: SecureStorageObject) => {
              console.log('Storage is ready!');
              //securely store
              storage.set('loginInfo', JSON.stringify(
                {
                  userId: this.responseObj.userId,
                  userType: this.responseObj.userType,
                  phoneNo: this.responseObj.phoneNo,
                  emailId: this.responseObj.emailId,
                  userName: this.responseObj.userName,
                  subscriptionTypeId: this.responseObj.subscriptionTypeId,
                  status: this.responseObj.Status,
                  userImage: this.responseObj.userImage,
                  firstLastName: this.responseObj.firstLastName,
                  havingBuyerAccount: this.responseObj.havingBuyerAccount,
                  havingSellerAccount: this.responseObj.havingSellerAccount,
                  isCompanyDetailsvailabel: this.responseObj.userBasicDetails.isCompanyDetailsvailabel,
                  isUserDetailsvailabel: this.responseObj.userBasicDetails.isUserDetailsvailabel,
                  companyName: this.responseObj.userBasicDetails.companyName,
                  userNameFull: this.responseObj.userBasicDetails.userNameFull
                }))
                .then(
                data => {
                  console.log('stored info');
                },
                error => console.log(error)
                );
              this.readyToLogin = true;
            },
            error => console.log(error)
          );

        }
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  checkEmaptyProfile() {
    const search_product = this.mainUrl + "Search/checkmandetaoryfieldsxx";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(search_product, JSON.stringify({ "userId": localStorage.getItem('userId') }), { headers: headers }).subscribe(data => {
        let resp: any = data;
        if (resp.response.status == 'success') {
          let detr = resp.response.responseListObject;
          if (detr.Status == true) {
            this.checkEmailId = true;
          } else {
            this.checkEmailId = false;
          }
          console.log(this.checkEmailId);
        }
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  sendOtp(emailId) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      "userName": emailId,
    };
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/sendOtp", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        this.all = data;

        if (this.all.response.status == "Success") {
          this.responseObj = this.all.response.responseObject;
        }
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  verifyOtp(username, otp) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = { "userName": username, "otp": otp };
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/verifyOtp", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  forgotPassword(mobileNo){
    
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = { requestFrom:"App",userEmail:"",userMobile:mobileNo };

    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/forgetPassword", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }
  changePassowrd(username, password) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = { "userName": username, "password": password };

    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/changePassword", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  confirmSignUp(userName, phoneNo) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      "userName": userName,
      "phoneNo": phoneNo,
      "requestFrom": 'App'
    };
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/confirmSignUp", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  signUp(postParams) {
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    return new Promise(resolve => {
      return this.http.post(this.mainUrl + "Login/signUpUser", JSON.stringify(postParams), { headers: headers }).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  

  logOut() {
    this.secureStorage.create('myDetails').then(
      (storage: SecureStorageObject) => {
      //securely store
      storage.remove('loginInfo');
      },
      error => console.log(error)
    );
    localStorage.clear();
    this.userImage = "";
    this.userName = "";
    this.firstLastName = "";
    this.userType = "";
    this.userId = "";
    this.phoneNo = "";
    this.emailId = "";
    this.havingBuyerAccount = "";
    this.havingSellerAccount = "";
  }

  // WhatsApp(){
  //   var headers = new HttpHeaders();
  //   headers.append("Accept", "application/json");
  //   return new Promise(resolve => {
  //     console.log("Before API")
  //     this.http.get("https://api.whatsapp.com/send?phone=+918600001932&text=I'm%20interested%20in%20your%20car%20for%20sale", { headers: headers }).subscribe(data => {
  //       resolve(data);
  //       console.log(data)
  //     }, err => {
  //     });
  //   });
  // }
}
