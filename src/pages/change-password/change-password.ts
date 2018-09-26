import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, ModalController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { Validators, FormBuilder,ValidatorFn,AbstractControl } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PasswordValidation } from './PasswordValidation';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  sendOtpScreen = true;
  sendOtpForm;
  sendOtpSubmitAttempt: boolean = false;


  verifyOtpScreen = false;
  verifyOtpForm;
  otp: string;
  verifyOtpSubmitAttempt: boolean = false;

  changePasswordScreen = false;
  changePasswordForm;
  username: string;
  password: string;
  cpassword: string;
  changeSubmitAttempt: boolean = false;

  all: any;
  responseObj: any;
  otpStatus;otpSentMessage;
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, public authProvider: AuthProvider,
    public sP: SearchProvider, public navParams: NavParams) {
       if (this.platform.is('android') || this.platform.is('ios')) {
         this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Change Password');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
       }
    this.sendOtpForm = formBuilder.group({
      username: ['', Validators.required],
    });

    this.verifyOtpForm = formBuilder.group({
      otp: ['', Validators.required],
    });

    this.changePasswordForm = formBuilder.group({
      password: ['', Validators.required],
      cpassword: ['', Validators.required]
    }, 
    {
      validator: PasswordValidation.MatchPassword // your validation method
    });
  }
  
  presentAlert(title, Msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: Msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  sendOtp() {
    this.sendOtpSubmitAttempt = true;
    if (!this.sendOtpForm.valid) {

      // console.log(this.sendOtpForm.status);
    }
    else {

      this.username = this.sendOtpForm.controls['username'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.sendOtp(this.username).then((result) => {
          this.all = result;
          if (this.all.response.status == 'Success') {
            loading.dismiss();
            this.otpSentMessage = this.all.response.responseObject.message;
            this.otpStatus='Send';
            this.sendOtpScreen = false;
            this.verifyOtpScreen = true;
          }
          else if (this.all.response.status == 'fail') {
            this.otpStatus='';
            loading.dismiss();
            let title = "Sending Failed.";
            let Msg = this.all.reasonCode.reasonCode;
            this.presentAlert(title, Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }

  verifyOtp() {
    this.verifyOtpSubmitAttempt = true;
    if (!this.verifyOtpForm.valid) {

    }
    else {
      
      this.otp = this.verifyOtpForm.controls['otp'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.verifyOtp(this.username, this.otp).then((result) => {
          this.all = result;
          if (this.all.response.status == 'Success') {
            loading.dismiss();
            this.verifyOtpScreen = false;
            this.changePasswordScreen = true;
            
          }
          else if (this.all.response.status == 'fail') {
            loading.dismiss();
            let title = "Sending Failed.";
            let Msg = this.all.reasonCode.reasonCode;
            this.presentAlert(title, Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }
  loginSend(username,password){
    const loading = this.loadingCtrl.create({
      content: 'Redirecting..'
    });
    loading.present().then(() =>{
      this.authProvider.login(this.username, this.password, 'Password').then((result) => {
        this.all = result;
        if (this.all.response.status == 'Success') {
            loading.dismiss();
            this.navCtrl.setRoot('DashboardPage');
          }
          else if (this.all.response.status == "fail") {
            loading.dismiss();
            let title = "Login Failed.";
            let Msg = this.all.reasonCode.reasonCode;
            this.presentAlert(title, Msg)
          }
       }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }
  changePassword(){
    this.changeSubmitAttempt = true;
    if (!this.changePasswordForm.valid) {
      //console.log(this.changePasswordForm.valid);
    }
    else {
      
      this.password = this.changePasswordForm.controls['password'].value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.authProvider.changePassowrd(this.username, this.password).then((result) => {
          this.all = result;
          if (this.all.response.status == 'Success') {
            loading.dismiss();
            this.verifyOtpScreen = false;
            this.changePasswordScreen = true;
            this.loginSend(this.username, this.password);
          }
          else if (this.all.response.status == 'fail') {
            loading.dismiss();
            let title = "Sending Failed.";
            let Msg = this.all.reasonCode.reasonCode;
            this.presentAlert(title, Msg)
          }
        }, (err) => {
          console.log(err);
        });
      });
    }
  }
}
