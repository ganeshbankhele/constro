import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, NavController, NavParams, LoadingController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public sP: SearchProvider,
    private ga: GoogleAnalytics,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public note: NotificationProvider,
    public platform: Platform,
  ) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
 }

  ionViewDidLoad() {

  }

  openPage(data) {
    let pageType = data.payload.val().notificationType;
    if (pageType == 'RFQ' || pageType == 'RFQ Response' || pageType == 'RFQ Revised Quote') {

     
      this.note.updateReadStatus(data.key);
      if(localStorage.getItem('userType')=='Seller'){
        this.navCtrl.push('ReuestSellerDetailsPage',{ param1: data.payload.val().id });
      }else{
        let det = { rspId: data.payload.val().id };
        this.navCtrl.push('RequestHistoryPage', { dataSend: det } );
      }

    } else if (pageType == 'Purchase Order') {
      this.note.updateReadStatus(data.key);
      this.navCtrl.push('ReuestSellerDetailsPage',{ param1: data.payload.val().id });
    } else if (pageType == 'Order Confirmed') {
      this.note.updateReadStatus(data.key);
      let det = { rspId: data.payload.val().id };
      this.navCtrl.push('RequestHistoryPage',{ dataSend: det });
    } else if (pageType == 'Contact Seller') {

      this.note.updateReadStatus(data.key);
      if(localStorage.getItem('userType')=='Seller'){
        this.navCtrl.push('EnquirySellerNewPage');
      }else{
        this.navCtrl.push('EnquiryNewPage');
      }
     
     
    }

  }

}
