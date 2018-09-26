import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, NavParams, LoadingController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { BuyLeadProvider } from '../../providers/buy-lead/buy-lead';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-purchased-leads',
  templateUrl: 'purchased-leads.html',
})
export class PurchasedLeadsPage {

  myLeads: any = [];
  noMoreResult: boolean = false;
  postParams: any = {
    "User_Id": localStorage.getItem('userId'),
    "User_Type": localStorage.getItem('userType'),
    "startLimit": 0,
    "noOfRecords": 20,
    "Request_From": "App",
    "Token": ""
  };
  constructor(
    public navCtrl: NavController,
    public mL: BuyLeadProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public note:NotificationProvider,
    public authProvider: AuthProvider,
    public popoverCtrl: PopoverController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {

     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.loadMyLeads();
  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  loadMyLeads() {
    const loading = this.loadingCtrl.create({ content: 'Please wait..' });
    loading.present().then(() => {
      this.mL.getPurchasedLeads(this.postParams).then((result) => {
        this.myLeads = result;
        this.postParams.startLimit = 20;
        loading.dismiss();
      }, (err) => {
        console.log(err);
      });
    });
  }

  doRefresh(refresher) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.postParams.startLimit = 0;
    this.mL.getPurchasedLeads(this.postParams).then((result) => {
      this.myLeads = result;
      console.log(this.myLeads);
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
    this.mL.getPurchasedLeads(this.postParams).then((result) => {
      if (Object.keys(result).length == 0) {
        this.noMoreResult = true;
        infiniteScroll.complete();
        //this.presentToast('No more products found');
      } else {
        for (let i = 0; i < Object.keys(result).length; i++) {
          this.myLeads.push(result[i]);
        }
        this.postParams.startLimit = parseInt(this.postParams.startLimit) + 20;
        infiniteScroll.complete();
      }
    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });

  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('BuyleadPopupPage');
    popover.present({
      ev: myEvent
    });
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }

}
