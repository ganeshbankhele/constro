import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, LoadingController, NavController, NavParams } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-termsofuse',
  templateUrl: 'termsofuse.html',
})
export class TermsofusePage {
  termstitle;
  rows: any;
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public co: CommonProvider,
    private ga: GoogleAnalytics,
    public authProvider: AuthProvider,
    public note: NotificationProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {

     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.loadPage();
  }
  openNotification(page) {
    this.navCtrl.push(page);
  }
  loadPage() {
    const loading = this.loadingCtrl.create({ content: 'Please wait..' });
    loading.present();
    this.co.termsOfUse().then((result) => {
      let dresult: any = result;
      if (dresult.response.status == 'Success') {
        this.termstitle = dresult.response.responseObject.title;
        this.rows = dresult.response.responseObject.row;
        loading.dismiss();
      }
    });
  }

}
