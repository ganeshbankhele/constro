import { Component } from '@angular/core';
import { IonicPage, ModalController,Platform, AlertController, NavController, LoadingController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { EnquiryProvider } from '../../providers/enquiry/enquiry';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-enquiry-seller-new',
  templateUrl: 'enquiry-seller-new.html',
})
export class EnquirySellerNewPage {
  noEnquiry: boolean = false;
  showSearchbar: boolean = false;
  leads: any = [];
  leadd:any = {};
  all: any; responseobj: any;
  noMoreResult: boolean = false;
  postParams: any = {
    "User_Id": localStorage.getItem('userId'),
    "User_Type": localStorage.getItem('userType'),
    "Request_From": "App",
    "noOfRecords": 20,
    "startLimit": 0,
    "Token": ""
  };
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private ga: GoogleAnalytics,
    public note:NotificationProvider,
    public platform: Platform,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public eqProvider: EnquiryProvider
  ) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.sellerRequest();
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  sellerRequest() {
    const loading = this.loadingCtrl.create({ content: 'Please wait..' });
    loading.present();
    this.eqProvider.getEnquiry(this.postParams).then((result) => {
      this.leads = result;
      this.noMoreResult = false;
      this.postParams.startLimit = 20;
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  doRefresh(refresher) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.postParams.startLimit = 0;
    this.eqProvider.getEnquiry(this.postParams).then((result) => {
      this.leads = result;
      this.noMoreResult = false;
      this.postParams.startLimit = 20;
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
    refresher.complete();
  }

  doInfinite(infiniteScroll: any) {
    this.eqProvider.getEnquiry(this.postParams).then((result) => {
      if (Object.keys(result).length == 0) {
        this.noMoreResult = true;
        infiniteScroll.complete();
        //this.presentToast('No more products found');
      }
      else {
        for (let i = 0; i < Object.keys(result).length; i++) {
          this.leads.push(result[i]);
        }
        this.postParams.startLimit = parseInt(this.postParams.startLimit) + 20;
        infiniteScroll.complete();
      }
    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });

  }

  openDetails(data) {
    this.navCtrl.push('LeadDetailsPage', { param1: data });
  }
}
