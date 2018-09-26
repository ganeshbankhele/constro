import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, Platform, Content, AlertController, NavController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-request-history',
  templateUrl: 'request-history.html',
})
export class RequestHistoryPage {
  @ViewChild(Content) content: Content;
  showTerms: boolean = false;
  respId: any = {};
  buyerDetails: any = {};
  term = [];
  postParams: any = {
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem('userType'),
    rfqProductLineId: "",
    token: ""
  };
  responseobj: any = {};
  buyerHistory: any = {};
  responseHistory: any = [];
  buttonStatus: any = {};
  showLevel1 = null;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public sP: SearchProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public req: RequestProvider, ) {
    if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.respId = navParams.get('dataSend');
    this.postParams.rfqProductLineId = this.respId.rspId;
    this.loadRfqHistory();
  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  ionViewWillEnter() {
    this.loadRfqHistory();
  }

  loadRfqHistory() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.req.loadBuyerRequestHistory(this.postParams).then((result) => {
        let allDetails: any = result;
        if (allDetails.response.status == 'Success') {
          this.responseHistory = allDetails.response.responseObject.responseDetails;
          this.buttonStatus = allDetails.response.responseObject.buttonStatus;
          setTimeout(() => {
            this.content.scrollToBottom(0);
          }, 1000);
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
    loading.present().then(() => {
      this.req.loadBuyerRequestHistory(this.postParams).then((result) => {
        let allDetails: any = result;
        if (allDetails.response.status == 'Success') {
          this.responseHistory = allDetails.response.responseObject.responseDetails;
          this.buttonStatus = allDetails.response.responseObject.buttonStatus;
          loading.dismiss();
          setTimeout(() => {
            this.content.scrollToBottom(0);
          }, 1000);
          refresher.complete();
        } else {
          this.presentAlert('Something Went Wrong, Please Try After Sometime.');
          loading.dismiss();
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
        refresher.complete();
      });
    });
  }

  toggleDetails(his) {
    if (his.termsShow) {
      his.termsShow = false;
    } else {
      his.termsShow = true;
    }
  }

  read(his) {
    his.termsShow = !his.termsShow;
  }
  readsp(his) {
    his.showSpecification = !his.showSpecification;
  }
  reviseQuote(rfqProId) {
    this.navCtrl.push('BuyerReviseQuotePage', { id: rfqProId });
  }

  purchaseOrder(resId) {
    this.navCtrl.push('PurchaseOrderPage', { id: resId });
  }

  viewPoDetails(poNo) {
    this.navCtrl.push('OrderDetailsPage', { param1: poNo });
  }
}
