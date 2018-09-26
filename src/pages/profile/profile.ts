import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams } from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  all: any;
  imagesData: any;
  companyLogo;
  constructor(public navCtrl: NavController,
    public prof: ProfileProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public note: NotificationProvider,
    public commn: CommonProvider,
    public authProvider: AuthProvider,
    public navParams: NavParams) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
  }
  openNotification(page) {
    this.navCtrl.push(page);
  }

  loadProfile() {
    let postParams = {
      "User_Id": localStorage.getItem('userId'),
      "User_Type": localStorage.getItem('userType'),
      "token": ""
    };
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.prof.loadProfile(postParams).then((result) => {
        this.all = result;
        if (this.all.response.status) {
          this.companyLogo = this.all.response.responseObject.Company_Logo;
          console.log(this.companyLogo);
          loading.dismiss();
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
  ionViewDidLoad() {
    this.loadProfile();
  }
  presentAlert(title, Msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: Msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  pushPage(page) {
    if (page == 'ProfileBasicDetailsPage') {
      this.navCtrl.push(page, { "data": this.prof.basicDetails });
    } else if (page == 'ProfileCompanyDetailsPage') {
      this.navCtrl.push(page, { "data": this.prof.compDetails });
    } else if (page == 'ProfileAwardsPage') {
      this.navCtrl.push(page, { "data": this.prof.awardsPhotos });
    } else if (page == 'ProfileMembershipPage') {
      this.navCtrl.push(page, { "data": this.prof.membershipPhotos });
    } else if (page == 'ProfileBankdetailsPage') {
      this.navCtrl.push(page, { "data": this.prof.bankDetails });
    }
  }

  openImage(url, id) {
    this.imagesData = {
      url: url,
      id: id
    }
    this.navCtrl.push('ImageEditPage', { "data": this.imagesData });
  }

  deleteImage(imgId) {
    let postParams = {
      Image_Id: imgId,
      User_Id: localStorage.getItem('userId'),
      Requset_From: 'App',
      image_type: 'CompanyPhotos'
    }


    const loading = this.loadingCtrl.create({
      content: 'Deleting...'
    });
    loading.present().then(() => {
      this.commn.deleteImage(postParams).then((result) => {
        var deleted: any = result;
        if (deleted.response.status == 'Success') {
          loading.dismiss();
        }
        else if (this.all.response.status == 'fail') {
          loading.dismiss();
          let Msg = this.all.reasonCode.reasonCode;
          this.presentAlert('', Msg)
        }
      }, (err) => {
        console.log(err);
      });
    });

  }

  logOut() {
    this.authProvider.logOut();
    this.navCtrl.setRoot('HomePage');
  }
}
