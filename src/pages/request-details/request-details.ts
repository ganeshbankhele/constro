import { Component } from '@angular/core';
import { IonicPage, LoadingController,Platform, AlertController, ToastController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { SearchProvider } from '../../providers/search/search';
import { RequestProvider } from '../../providers/request/request';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-request-details',
  templateUrl: 'request-details.html',
})
export class RequestDetailsPage {
  showSpec: boolean = false;
  showResult: boolean = false;
  rfqId: number;
  postParams: any = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "rfqId": "",
    "token": ""
  };
  responseobj: any = {};
  buyerDetails: any = {};
  responseDetail: any = [];
  sellers: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public sP: SearchProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public toastCtrl: ToastController,
    public authProvider: AuthProvider,
    public req: RequestProvider, ) {
       if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.rfqId = navParams.get('param1');
    this.postParams.rfqId = this.rfqId;
    this.loadRfqDetails();
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  loadRfqDetails() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.req.loadBuyerRequestDetails(this.postParams).then((result) => {
        let allDetails: any = result;
        if (allDetails.response.status == 'Success') {
          this.responseobj = allDetails.response.responseObject;;
          this.buyerDetails = this.responseobj.BuyerDetails[0];
          this.sellers = this.responseobj.responseDetails;
          loading.dismiss();
          this.showResult = true;
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
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }

  ionViewDidLoad() {

  }
  search_tool(status) {
    this.sP.search_tool(status);
  }
  showSpecfi() {
    this.showSpec = !this.showSpec;
  }

  openResp(respId, status) {
    //if (status == 'Yes') {
      this.openHistory(respId);
   // } else {
     // this.presentToast('Response Not Received Yet.')
   // }
  }
  openHistory(respId) {
    let det = { rspId: respId };
    this.navCtrl.push('RequestHistoryPage',{dataSend:det});
  }
  pushPage(page) {
    this.navCtrl.push(page);
  }

  
}
