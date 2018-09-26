import { Component } from '@angular/core';
import { IonicPage, ModalController,Platform, LoadingController, AlertController, NavController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-reuest-seller',
  templateUrl: 'reuest-seller.html',
})
export class ReuestSellerPage {
  all: any;
  responseobj: any = [];
  noMoreResult: boolean = false;
  noRequest: boolean = false;
  postParams: any = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "noOfRecords": 20,
    "startLimit": 0,
    "token": ""
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public sP: SearchProvider,
    private ga: GoogleAnalytics,
    public note:NotificationProvider,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public req: RequestProvider,
  ) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.loadSellerRequest();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  loadSellerRequest() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.req.loadSellerRequest(this.postParams).then((result) => {
        let all: any = result;
        if (all.response.status == 'Success') {
          this.responseobj = all.response.responseObject.requestResults;
          if (this.responseobj.length == 0) {
            this.noRequest = true;
          }
          loading.dismiss();
        } else {
          this.presentAlert('Something Went Wrong, Please Try After Sometime.');
          loading.dismiss();
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }

  doRefresh(refresher) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.postParams.startLimit = 0;
    this.req.loadSellerRequest(this.postParams).then((result) => {
      let all:any = result;
      if(all.response.status=='Success'){
        this.responseobj = all.response.responseObject.requestResults;
        if (this.responseobj.length == 0) {
          this.noRequest = true;
        }
     
      loading.dismiss();
    } else {
      this.presentAlert('Something Went Wrong, Please Try After Sometime.');
      loading.dismiss();
    }
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
    refresher.complete();
  }

  doInfinite(infiniteScroll: any) {
    this.req.loadSellerRequest(this.postParams).then((result) => {
      let all:any = result;
      if(all.response.status=='Success'){
        this.responseobj = all.response.responseObject.requestResults;
      if (Object.keys( this.responseobj).length == 0) {
        this.noMoreResult = true;
        infiniteScroll.complete();
        //this.presentToast('No more products found');
      }
      else {
        for (let i = 0; i < Object.keys( this.responseobj).length; i++) {
          this.responseobj.push( this.responseobj[i]);
        }
        this.postParams.startLimit = parseInt(this.postParams.startLimit) + 20;
        infiniteScroll.complete();
      }
    } else {
      this.presentAlert('Something Went Wrong, Please Try After Sometime.');
      infiniteScroll.complete();
    }
    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });

  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }


  
  openRequest(rfqid) {
    this.navCtrl.push('ReuestSellerDetailsPage', { param1: rfqid });
  }

}
