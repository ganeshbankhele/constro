import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

/**
 * Generated class for the TermsPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-terms-payment',
  templateUrl: 'terms-payment.html',
})
export class TermsPaymentPage {

  constructor(public navCtrl: NavController,
    private ga: GoogleAnalytics,
    public platform: Platform,
     public navParams: NavParams) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TermsPaymentPage');
  }

}
