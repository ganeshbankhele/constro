import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, ModalController, NavParams, ViewController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { Validators, FormBuilder } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../validators/emailValidator';
import { PasswordValidation } from './PasswordValidation';
import { changePasswordValidation } from './changePasswordValidation';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-login-sign-up',
  templateUrl: 'login-sign-up.html',
})
export class LoginSignUpPage {
  title_head: string = 'Sign In';
  loginType: string = 'Password';
  loginForm; otpStatus = '';
  otp; otpsubmitAttempt; otpSentMessage;
  otpverify; otpverifysubmitAttempt;
  username: string; password: string;
  submitAttempt: boolean = false;
  all: any;
  signUpAs;
  responseObj: any;
  signUpForm; signUpAttempt = false;
  confirmOtp; confirmOtpsubmitAttempt; otpSentMessageconfirm;

  /* change password start */

  sendOtpScreen = true;
  sendOtpForm;
  sendOtpSubmitAttempt: boolean = false;


  verifyOtpScreen = false;
  verifyOtpForm;
  changeotp: string;
  verifyOtpSubmitAttempt: boolean = false;

  changePasswordScreen = false;
  changePasswordForm;
  chusername: string;
  chpassword: string;
  cpassword: string;
  changeSubmitAttempt: boolean = false;

  chall: any;
  chresponseObj: any;
  chotpStatus;
  chotpSentMessage;

  /* change password end */
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public note:NotificationProvider,
    public alertCtrl: AlertController, public authProvider: AuthProvider, public viewCtrl: ViewController,
    public sP: SearchProvider, public navParams: NavParams) {
       if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.title_head = 'Sign In';

    this.loginForm = formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.otp = formBuilder.group({
      username: ['', Validators.required]
    });

    this.otpverify = formBuilder.group({
      otp: ['', Validators.required]
    });

    this.signUpForm = formBuilder.group({
      mobile: ['', Validators.required],
      email: ['', Validators.compose([EmailValidator.isValid])],
      signUpPassword: ['', Validators.compose([Validators.minLength(4), Validators.required])],
      signUpcPassword: ['', Validators.required],
      signUpAs: ['Buyer', Validators.required]
    },
      {
        validator: PasswordValidation.MatchPassword // your validation method
      });
    this.signUpAs = "Buyer";


    this.confirmOtp = formBuilder.group({
      otp: ['', Validators.required]
    });

    /* change password start */
    this.sendOtpForm = formBuilder.group({
      chusername: ['', Validators.required],
    });

    this.verifyOtpForm = formBuilder.group({
      chotp: ['', Validators.required],
    });

    this.changePasswordForm = formBuilder.group({
      chpassword: ['', Validators.required],
      chcpassword: ['', Validators.required]
    },
      {
        validator: changePasswordValidation.MatchPassword // your validation method
      });
    /* change password end */


  }

  selectedType(val) {
    this.signUpAs = val;
  }
  confirmSignupOtp() {
    this.confirmOtpsubmitAttempt = true;
    if (!this.confirmOtp.valid) {
    }
    else {
      this.username = this.signUpForm.controls['mobile'].value;
      this.password = this.confirmOtp.controls['otp'].value;
      this.afterOtpVerify(this.username, this.password, 'signUp');
    }
  }
  goshignUpBack() {
    this.title_head = "Sign Up";
  }
  signUp() {
    this.signUpAttempt = true;
    if (!this.signUpForm.valid) {
    }
    else {
      let postParams = {
        "userType": this.signUpAs,
        "emailId": this.signUpForm.controls['email'].value,
        "phoneNo": this.signUpForm.controls['mobile'].value,
        "phonePrefix": "+91",
        "userPassword": this.signUpForm.controls['signUpPassword'].value,
        "requestFrom": 'App',
        "captcha": ''
      };
      
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.signUp(postParams).then((result) => {
          this.all = result;
          if (this.all.response.status == 'Success') {
            if (this.all.response.responseObject.Status == 'Success') {
              this.title_head = "Confirm SignUp";
              this.otpSentMessageconfirm = this.all.response.responseObject.actingMessage;
              loading.dismiss();
            } else {
              loading.dismiss();
              //let title = "Sending Failed.";
              let Msg = this.all.response.responseObject.actingMessage;
              this.presentAlert(Msg)
            }
          }
          else if (this.all.response.status == 'fail') {
            this.title_head = "Confirm SignUp";
            // this.otpStatus='';
            loading.dismiss();
            let Msg = this.all.reasonCode.reasonCode;
            this.presentAlert(Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }
  sendOtp() {
    this.otpsubmitAttempt = true;
    if (!this.otp.valid) { }
    else {
      this.otpStatus = 'Send';
      this.username = this.otp.controls['username'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.sendOtp(this.username).then((result) => {
          this.all = result;
          if (this.all.response.status == 'Success') {
            this.otpSentMessage = this.all.response.responseObject.message;
            loading.dismiss();
          }
          else if (this.all.response.status == 'fail') {
            this.otpStatus = '';
            loading.dismiss();

            let Msg = this.all.reasonCode.reasonCode;
            this.presentAlert(Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }



  presentAlert(Msg) {
    const alert = this.alertCtrl.create({
      subTitle: Msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  changeType(element) { this.loginType = (element == "Password") ? 'Password' : 'Otp'; }
  changeForm(type) { this.title_head = type; }

  goForget() {
    this.title_head = 'change password';
  }

  login() {
    this.submitAttempt = true;
    if (!this.loginForm.valid) {
     
    }
    else {
      this.username = this.loginForm.controls['username'].value;
      this.password = this.loginForm.controls['password'].value;
      this.loginSend(this.username, this.password);
    }
  }
  loginSend(username, password) {
    const loading = this.loadingCtrl.create({
      content: 'Redirecting..',
      dismissOnPageChange: true
    });
    loading.present().then(() => {
      this.authProvider.login(username, password,this.loginType).then((result) => {
        this.all = result;
       
        if (this.all.response.status == 'Success') {
          loading.dismiss();
          this.viewCtrl.dismiss(true);
          this.note.readNotification().then((result) => {});
         
        }
        else if (this.all.response.status == "fail") {
          loading.dismiss();

          let Msg = 'Invalid username or password.';
          this.presentAlert(Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }
  verifyOtp() {
    this.otpverifysubmitAttempt = true;
    if (!this.otpverify.valid) {
    }
    else {
      this.password = this.otpverify.controls['otp'].value;
      this.afterOtpVerify(this.username, this.password, 'forget');
    }
  }

  afterOtpVerify(username, password, from) {
    const loading = this.loadingCtrl.create({
      content: 'Verifying OTP...'
    });
    loading.present().then(() => {
      this.authProvider.verifyOtp(username, password).then((result) => {
        this.all = result;
        if (this.all.response.status == 'Success') {
          loading.dismiss();
          if (from == 'signUp') {
            let userName = this.signUpForm.controls['email'].value;
            let phoneNo = this.signUpForm.controls['mobile'].value;
            let pass = this.signUpForm.controls['signUpPassword'].value;
            const loading1 = this.loadingCtrl.create({
              content: 'Activating Account...'
            });
            loading1.present().then(() => {
              this.authProvider.confirmSignUp(userName, phoneNo).then((result) => {
                this.all = result;
                if (this.all.response.status == 'Success') {
                  loading1.dismiss();
                  this.loginSend(username, pass);
                }
                else if (this.all.response.status == "fail") {
                  loading1.dismiss();

                  let Msg = this.all.reasonCode.reasonCode;
                  this.presentAlert(Msg)
                }
              });
            });
          }
          else {
            this.loginSend(username, password);
          }

        }
        else if (this.all.response.status == "fail") {
          loading.dismiss();
          let Msg = "OTP Not matched.";
          this.presentAlert(Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }
  goBack() {
    this.otpsubmitAttempt = false;
    this.otpStatus = "";
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }
  /* search logic */

  locationSearch() {
    let locationModal = this.modalCtrl.create('LocationPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      this.sP.location = data.Location;
      this.sP.product_search.country_id = data.Country_Id;
      this.sP.product_search.state_id = data.State_Id;
      this.sP.product_search.city_id = data.City_Id;
      this.sP.product_search.location_id = data.Location_Id;
      this.sP.product_search.Location_Name = data.Location;
      this.sP.showSearchbar = false;
      this.navCtrl.setRoot('SearchPage');
    });
  }

  productSearch() {
    let productModal = this.modalCtrl.create('ProductServicePage');
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
      this.sP.product_search.search_text = data.Seller_Product;
      this.sP.product_text = data.Seller_Product;
      this.locationSearch();
    });
  }
  search_tool(status) {
    this.sP.search_tool(status);
  }
  /* search end */
  resendOtp() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      let mboleOtp = this.signUpForm.controls['mobile'].value
      this.authProvider.sendOtp(mboleOtp).then((result) => {
        this.chall = result;
        if (this.chall.response.status == 'Success') {
          loading.dismiss();
          this.otpSentMessage = this.chall.response.responseObject.message;
          this.otpStatus = 'Send';

        }
        else if (this.chall.response.status == 'fail') {
          this.otpStatus = '';
          loading.dismiss();
          let Msg = this.chall.reasonCode.reasonCode;
          this.presentAlert(Msg)
        }
      }, (err) => {
        console.log(err);
      });
    });
  }
  /* change password logic */

  sendOtpCh() {
    this.sendOtpSubmitAttempt = true;
    if (!this.sendOtpForm.valid) {

    }
    else {

      this.chusername = this.sendOtpForm.controls['chusername'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.forgotPassword(this.chusername).then((result) => {
          this.chall = result;
          if (this.chall.response.status == 'Success') {
            if (this.chall.response.responseObject.ForgetPasswordStatus != "Failed") {
              this.chotpSentMessage = this.chall.response.responseObject.actingMessage;
              loading.dismiss();
              this.chotpStatus = 'Send';
              this.sendOtpScreen = false;
              this.verifyOtpScreen = true;
            } else {
              this.chotpStatus = '';
              loading.dismiss();
              let Msg = "Invalid data submitted.";
              this.presentAlert(Msg)
            }
          }
          else if (this.chall.response.status == 'fail') {
            this.chotpStatus = '';
            loading.dismiss();

            let Msg = this.chall.reasonCode.reasonCode;
            this.presentAlert(Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }

  verifyOtpCh() {
    this.verifyOtpSubmitAttempt = true;
    if (!this.verifyOtpForm.valid) {

    }
    else {

      this.otp = this.verifyOtpForm.controls['chotp'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.verifyOtp(this.chusername, this.otp).then((result) => {
          this.chall = result;
          if (this.chall.response.status == 'Success') {
            loading.dismiss();
            this.verifyOtpScreen = false;
            this.changePasswordScreen = true;

          }
          else if (this.chall.response.status == 'fail') {
            loading.dismiss();
            let Msg = this.chall.reasonCode.reasonCode;
            this.presentAlert(Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }

  loginSendCh(username, password) {
    const loading = this.loadingCtrl.create({
      content: 'Redirecting..'
    });
    loading.present().then(() => {
      this.authProvider.login(this.chusername, this.chpassword, 'Password').then((result) => {
        this.chall = result;
        if (this.chall.response.status == 'Success') {
          this.note.readNotification().then((result) => {});
          loading.dismiss();
          this.viewCtrl.dismiss(true);
          // this.navCtrl.setRoot('DashboardPage');
        }
        else if (this.chall.response.status == "fail") {
          loading.dismiss();

          let Msg = this.chall.reasonCode.reasonCode;
          this.presentAlert(Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }

  changePassword() {
    this.changeSubmitAttempt = true;
    if (!this.changePasswordForm.valid) {
      //console.log(this.changePasswordForm.valid);
    }
    else {

      this.chpassword = this.changePasswordForm.controls['chpassword'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.changePassowrd(this.chusername, this.chpassword).then((result) => {
          this.chall = result;
          if (this.chall.response.status == 'Success') {
            loading.dismiss();
            this.verifyOtpScreen = false;
            this.changePasswordScreen = true;
            this.loginSendCh(this.chusername, this.chpassword);
          }
          else if (this.chall.response.status == 'fail') {
            loading.dismiss();

            let Msg = this.chall.reasonCode.reasonCode;
            this.presentAlert(Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }

  /* change password logic end */

  openTerms() {
    this.navCtrl.push('TermsofusePage');
  }

  openPolicy() {
    this.navCtrl.push('PrivacypolicyPage');
  }
}
