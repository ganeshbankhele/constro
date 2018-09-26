import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ModalController,ToastController, LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthProvider } from '../providers/auth/auth';
import { Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
//import { Firebase } from '@ionic-native/firebase';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { App } from 'ionic-angular';
import { NotificationProvider } from '../providers/notification/notification'
import { FCM } from "@ionic-native/fcm";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: string = 'HomePage';
  token: string;
  all: any;
  counter=0;
  lastBack;
  allowClose:boolean=false;
  
  constructor(public platform: Platform,
    public events: Events,
    private fcm: FCM,
    //private fcm: Firebase,
    public modalCtrl: ModalController,
    // private cookieService: CookieService,
    public statusBar: StatusBar,
    public app: App,
    public toastCtrl:ToastController,
    public alertCtrl: AlertController,
    public splashScreen: SplashScreen,
    private iab: InAppBrowser,
    private secureStorage: SecureStorage,
    private spinnerDialog: SpinnerDialog,
    private socialSharing: SocialSharing,
    public loadingCtrl: LoadingController,
    public note: NotificationProvider,
    public authProvider: AuthProvider) {

    this.initializeApp();


    //   if(this.platform.is('core') || this.platform.is('mobileweb')) {
    //     this.authProvider.checkLogFromCookies()
    //     console.log('browser');
    //  }
  }

  initializeApp() {
    this.platform.ready().then(() => {

      if (this.platform.is('android') || this.platform.is('ios')) {


        this.fcm.getToken().then(token => {
        //  backend.registerToken(token);
           this.token = token;
           console.log(this.token);
         })

          //   this.fcm.onNotification().subscribe(data => {
        //     if (data.wasTapped) {
        //       console.log("Received in background");
        //       this.nav.setRoot('NotificationPage');

        //     } else {
        //       console.log("Received in foreground");
        //       this.nav.setRoot('SettingsPage');
        //     };
        //   })
        this.fcm.onTokenRefresh().subscribe(token => {
        // backend.registerToken(token);
           this.token = token;
         })
       // this.fcm.unsubscribeFromTopic('marketing');
      }
      this.statusBar.styleDefault();
      if (StatusBar) {
        if (this.platform.is('ios')) {
          this.statusBar.overlaysWebView(true); // let status bar overlay webview
        } else {
          this.statusBar.overlaysWebView(false);
        }
      }
      this.statusBar.backgroundColorByHexString("#fd5c63");
      //this.authProvider.callSession();      
      this.splashScreen.hide();
     
      this.platform.registerBackButtonAction(() => {
      let activePortal = this.app._appRoot._loadingPortal.getActive() || this.app._appRoot._modalPortal.getActive() || this.app._appRoot._overlayPortal.getActive();
      const nav = this.app.getActiveNav();
      const closeDelay = 2000;
      const spamDelay = 500;
    
      if(activePortal) 
      {
        activePortal.dismiss();
        
      } else if(nav.canGoBack()){
        nav.pop();
      } else if(Date.now() - this.lastBack > spamDelay && !this.allowClose) {
        this.allowClose = true;
        this.presentToast();
      } else if(Date.now() - this.lastBack < closeDelay && this.allowClose) {
        this.platform.exitApp();
      }
      this.lastBack = Date.now();
    });
  });

  this.platform.ready().then(() => {
    this.secureStorage = new SecureStorage();
    this.secureStorage.create('myDetails').then(
      (storage: SecureStorageObject) => {
        
        storage.get('loginInfo')
          .then(
          data => {
            // console.log('data was '+data);
            let { userId, userType, phoneNo, emailId, userName,
              userImage, firstLastName, havingBuyerAccount,
              havingSellerAccount,isCompanyDetailsvailabel,
              isUserDetailsvailabel,
              companyName,
              userNameFull } = JSON.parse(data);
            localStorage.setItem('userId', userId);
            localStorage.setItem('phoneNo', phoneNo);
            localStorage.setItem('emailId', emailId);
            localStorage.setItem('userName', userName);
            localStorage.setItem('userType', userType);
            localStorage.setItem('userImage', userImage);
            localStorage.setItem('firstLastName', firstLastName);
            localStorage.setItem('havingBuyerAccount', havingBuyerAccount);
            localStorage.setItem('havingSellerAccount', havingSellerAccount);
            localStorage.setItem('isCompanyDetailsvailabel', isCompanyDetailsvailabel);
            localStorage.setItem('isUserDetailsvailabel', isUserDetailsvailabel);
            localStorage.setItem('companyName', companyName);
            localStorage.setItem('userNameFull', userNameFull);
            this.authProvider.userId = localStorage.getItem('userId');
            this.authProvider.userType = localStorage.getItem('userType');
            console.log(this.authProvider.userType);
            this.authProvider.phoneNo = localStorage.getItem('phoneNo');
            this.authProvider.emailId = localStorage.getItem('emailId');
            this.authProvider.userName = localStorage.getItem('userName');
            this.authProvider.userImage = localStorage.getItem('userImage');
            this.authProvider.firstLastName = localStorage.getItem('firstLastName');
            this.authProvider.havingBuyerAccount = localStorage.getItem('havingBuyerAccount');
            this.authProvider.havingSellerAccount = localStorage.getItem('havingSellerAccount');
            this.authProvider.isCompanyDetailsvailabel= localStorage.getItem('isCompanyDetailsvailabel');
            this.authProvider.isUserDetailsvailabel= localStorage.getItem('isUserDetailsvailabel');
            this.authProvider.companyName=localStorage.getItem('companyName');
            this.authProvider.userNameFull=localStorage.getItem('userNameFull');
          },
          error => {
            // do nothing - it just means it doesn't exist
          }
          );
        this.authProvider.readyToLogin = true;
      },
      error => console.log(error)
    );
  });
   this.note.readNotification().then((result) => {});
  

}
presentToast() {
  let toast = this.toastCtrl.create({
    message: "Press again to exit",
    duration: 3000,
    position: "bottom"
  });
  toast.present();
}

openPage(page) {
  this.nav.setRoot(page);
}
openPagePush(page) {
  this.nav.push(page);
}


logOut() {
  this.authProvider.logOut();
  this.nav.setRoot('HomePage');
}

presentAlert(title, Msg) {
  const alert = this.alertCtrl.create({
    title: title,
    subTitle: Msg,
    buttons: ['Dismiss']
  });
  alert.present();
}

openlogin() {
  let locationModal = this.modalCtrl.create('LoginSignUpPage');
  locationModal.present({ keyboardClose: false });
  locationModal.onDidDismiss((data) => {
    if (data) {
      if (this.authProvider.loginAs == "") {
        this.nav.setRoot('DashboardPage')
      }
    }
  });
}

checkUser(type) {
  let chUser = this.modalCtrl.create('BeABasicDetailsPage', { userType: type });
  chUser.present({ keyboardClose: false });
  chUser.onDidDismiss((data) => {
    if (data != null) {
      this.switchUser(data);
    }
  });
}



switchUser(logtousertype) {
  let parameters = {
    "phoneNo": this.authProvider.phoneNo,
    "emailId": this.authProvider.emailId,
    "userType": logtousertype,
    "requestFrom": "App",
    "token": ""
  };

  const loading = this.loadingCtrl.create({
    content: 'Switching to ' + logtousertype
  });
  loading.present().then(() => {
    this.authProvider.setUserDetails(parameters).then((result) => {
      this.all = result;
      this.note.readNotification().then((result) => {});
      if (this.all.response.status == 'Success') {
        loading.dismiss();
        if (this.authProvider.userType == 'Buyer') {
          this.nav.setRoot('DashboardPage');
        }
        else if (this.authProvider.userType == 'Seller') {
          this.nav.setRoot('DashboardSellerPage');
        }
        else {
          this.nav.setRoot('HomePage');
        }

      }
      else if (this.all.response.status == "fail") {
        loading.dismiss();
        let title = "Switching Failed.";
        let Msg = this.all.reasonCode.reasonCode;
        this.presentAlert(title, Msg)
      }
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  });

}



openFacebook() {
  this.brows("https://m.facebook.com/constrobazaar/");
}

openTwitter() {
  this.brows("https://twitter.com/ConstroBazaar");
}

openLinkedin() {
  this.brows("https://www.linkedin.com/company/constrobazaar-pvt-ltd");
}

openGooglePlus() {
  this.brows("https://plus.google.com/106135661925932504571");
}

openYoutube() {
  this.brows("https://www.youtube.com/channel/UCIMwxTWxHtPeydSuYX1cLVg");
}
brows(url) {
  const options: InAppBrowserOptions = {
    location: 'no', clearcache: 'yes', hardwareback: 'no', zoom: 'no'
  }
  const browser = this.iab.create(url, "_system", options);
  browser.on('loadstart').subscribe((eve) => {
    this.spinnerDialog.show(null, null, true);
  }, err => {
    this.spinnerDialog.hide();
  })

  browser.on('loadstop').subscribe(() => {
    this.spinnerDialog.hide();
  }, err => {
    this.spinnerDialog.hide();
  })

  browser.on('loaderror').subscribe(() => {
    this.spinnerDialog.hide();
  }, err => {
    this.spinnerDialog.hide();
  })

  browser.on('exit').subscribe(() => {
    this.spinnerDialog.hide();
  }, err => {
    this.spinnerDialog.hide();
  })

}

openWhatsapp() {

  const options: InAppBrowserOptions = {
    location: 'no', clearcache: 'yes', hardwareback: 'no', zoom: 'no'
  }
  const browser = this.iab.create("https://api.whatsapp.com/send?phone=918600001932&abid=918600001932", "_system", options);
  browser.on('loadstart').subscribe((eve) => {
    this.spinnerDialog.show(null, null, true);
  }, err => {
    this.spinnerDialog.hide();
  })

  browser.on('loadstop').subscribe(() => {
    this.spinnerDialog.hide();
  }, err => {
    this.spinnerDialog.hide();
  })

  browser.on('loaderror').subscribe(() => {
    this.spinnerDialog.hide();
  }, err => {
    this.spinnerDialog.hide();
  })

  browser.on('exit').subscribe(() => {
    this.spinnerDialog.hide();
  }, err => {
    this.spinnerDialog.hide();
  })

  // var msg = "";
  // this.socialSharing.shareViaWhatsApp(msg, null, 'https://www.constrobazaar.com');

}

}
