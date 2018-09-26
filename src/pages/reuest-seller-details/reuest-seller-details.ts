import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, Platform, LoadingController, Content, AlertController, NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import { PoProvider } from '../../providers/po/po';
// import { HideFabDirective } from "../../directives/hide-fab/hide-fab";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
@IonicPage()
@Component({
  selector: 'page-reuest-seller-details',
  templateUrl: 'reuest-seller-details.html',
})
export class ReuestSellerDetailsPage {
  @ViewChild(Content) content: Content;

  showResult: boolean = false;
  showSpec: boolean = false;
  rfqId: number;
  postParams: any = {
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem('userType'),
    rfqProductLineId: "",
    token: ""
  };

  postParamsOa: any = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "poId": "",
    "token": ""
  };

  oaSuccess: any= {};
  buttonStatus: any = {};
  responseobj: any = {};
  sellerDetails: any = {};
  respoId;
  responseHistory: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    private ga: GoogleAnalytics,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    public platform: Platform,
    public poProvider: PoProvider,
    public req: RequestProvider) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.rfqId = navParams.get('param1');
    this.postParams.rfqProductLineId = this.rfqId;
    // this.loadSellerRfqDetails();
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  scrollTop() {
    setTimeout(() => {
      this.content.scrollToTop(0);
    }, 1000);
  }

  // ionViewDidLoad() {
  //   setTimeout(() => {
  //     this.content.scrollToBottom(0);
  //   }, 1000);
  // }

  ionViewWillEnter() {
    this.loadSellerRfqDetails();
    // setTimeout(() => {
    //   this.content.scrollToBottom(0);
    // }, 1000);
  }


  loadSellerRfqDetails() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.req.loadSellerRequestDetails(this.postParams).then((result) => {
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
      this.req.loadSellerRequestDetails(this.postParams).then((result) => {
        let allDetails: any = result;
        if (allDetails.response.status == 'Success') {
          this.responseHistory = allDetails.response.responseObject.responseDetails;
          this.buttonStatus = allDetails.response.responseObject.buttonStatus;
          loading.dismiss();
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
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }

  showSpecfi() {
    this.showSpec = !this.showSpec;
  }

  readsp(his) {
    his.showSpecification = !his.showSpecification;
  }

  openHistory(respId) {
    console.log(respId);
    this.navCtrl.push('RequestHistoryPage', { param1: respId });
  }

  sendResponse(type, id) {
    // console.log(type +'  '+ id);
    this.navCtrl.push('SellerResponsePage', { "type": type, "id": id });
  }

  read(his) {

    his.termsShow = !his.termsShow;
    console.log(his.termsShow);
  }

  pushPage(page) {
    this.navCtrl.push(page);
  }

  viewPoDetails(poNo) {
    this.navCtrl.push('OrderDetailsPage', { param1: poNo });
  }

  confirmOrder(poId) {
    this.postParamsOa.poId = poId;
    const loading = this.loadingCtrl.create({
      content: 'Please wait..'
    });
    loading.present();
    this.poProvider.submitOA(this.postParamsOa).then((result) => {
      this.oaSuccess = result;
      this.oaSuccess = this.oaSuccess.response;
      let pushNotifications = this.oaSuccess.responseObject.pushNotifications;
            if (pushNotifications.length > 0) {
              let icntr;
              let today = new Date();
              for (icntr = 0; icntr < pushNotifications.length; icntr++) {
                // this.note.genUserAll = this.db.list('/usernotification/' + pushNotifications[icntr].Buyer_Id);              
                // this.note.genUserAll.push({
                //   "message": pushNotifications[icntr].message,
                //   "isRead": "No",
                //   "postedDate": today.toLocaleString(),
                //   "notificationType": pushNotifications[icntr].notificationType,
                //   "status": pushNotifications[icntr].status,
                //   "id": pushNotifications[icntr].id,
                //   "userType": pushNotifications[icntr].userType,
                //   "icon": pushNotifications[icntr].Company_Logo,
                //   "redirectUrl": pushNotifications[icntr].redirectUrl,
                // });
              }
            }
      loading.dismiss();
      this.loadSellerRfqDetails();

    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }
}
