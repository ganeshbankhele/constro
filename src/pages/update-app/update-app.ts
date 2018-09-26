import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ViewController, NavParams } from 'ionic-angular';
import { Market } from '@ionic-native/market';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-update-app',
  templateUrl: 'update-app.html',
})
export class UpdateAppPage {
  message: any = [];
  constructor(public navCtrl: NavController,
    private market: Market,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public viewCtrl: ViewController,
    public navParams: NavParams) {

     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.message = this.navParams.get('updateMessage');
  }

  update() {
    // https://play.google.com/store/apps/details?id=pkg.cb
    this.market.open('pkg.cb');
  }

  back() {
    this.viewCtrl.dismiss(null);
  }
}
