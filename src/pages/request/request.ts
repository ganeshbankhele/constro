import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, LoadingController, ToastController, AlertController, NavController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import { trigger, state, style, keyframes, animate, transition } from '@angular/animations';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-request',
  templateUrl: 'request.html',
  animations: [
    trigger('heroState', [
      state('inactive', style({ transform: 'border-radius:5px;' })),
      state('active', style({ transform: 'border-radius:5px;' })),
      transition('inactive => active', [
        animate(300, keyframes([
          style({ opacity: 1.0, offset: 0 }),
          style({ opacity: 0.2, offset: 0.2 }),
          style({ opacity: 0.1, offset: 0.5 }),
          style({ opacity: 0.2, offset: 0.8 }),
          style({ opacity: 1.0, offset: 1.0 })
        ]))
      ]),
      transition('active => inactive', [
        animate(300, keyframes([
          style({ opacity: 1.0, offset: 0 }),
          style({ opacity: 0.2, offset: 0.2 }),
          style({ opacity: 0.1, offset: 0.5 }),
          style({ opacity: 0.2, offset: 0.8 }),
          style({ opacity: 1.0, offset: 1.0 })
        ]))
      ])
    ])

  ]
})
export class RequestPage {
  all: any;
  responseobj: any = [];
  noMoreResult: boolean = false;
  noRequest: boolean = false;
  public state = 'inactive';
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
    public platform: Platform,
    public note: NotificationProvider,
    public toastCtrl: ToastController,
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
    this.loadBuyerRequest();
  }

  openNotification(page) {
    this.navCtrl.push(page);
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  loadBuyerRequest() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.req.loadBuyerRequest(this.postParams).then((result) => {
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
    this.req.loadBuyerRequest(this.postParams).then((result) => {
      let all: any = result;
      if (all.response.status == 'Success') {
        this.responseobj = all.response.responseObject.requestResults;
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
    this.req.loadBuyerRequest(this.postParams).then((result) => {
      let all: any = result;
      if (all.response.status == 'Success') {
        let responseobj = all.response.responseObject.requestResults;
        if (Object.keys(responseobj).length == 0) {
          this.noMoreResult = true;
          infiniteScroll.complete();
          //this.presentToast('No more products found');
        }
        else {
          for (let i = 0; i < Object.keys(responseobj).length; i++) {
            this.responseobj.push(responseobj[i]);
          }
          this.postParams.startLimit = parseInt(this.postParams.startLimit) + 20;
          infiniteScroll.complete();
        }
      } else {
        this.presentAlert('Something Went Wrong, Please Try After Sometime.');

      }

    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });

  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }

  read(his) {
    his.specificShow = !his.specificShow;
  }

  /* search logic */
  closeSearchBar() {
    this.sP.showSearchbar = false;
  }



  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  setSearch(product, location) {
    if (product != "" && location != "") {
      this.sP.showSearchbar = false;
      this.sP.product_search.filters = [];
      this.navCtrl.setRoot('SearchPage');
    } else {
      this.presentToast('Please Fill Product And Location To Search');
    }
  }

  locationSearch() {
    let locationModal = this.modalCtrl.create('LocationPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      if (data != null) {
        this.sP.location = data.Location;
        this.sP.product_search.country_id = data.Country_Id;
        this.sP.product_search.state_id = data.State_Id;
        this.sP.product_search.city_id = data.City_Id;
        this.sP.product_search.location_id = data.Location_Id;
        this.sP.product_search.Location_Name = data.Location;

        if (this.sP.product_text != "") {
          this.sP.product_search.filters = [];
          this.sP.showSearchbar = false;
          this.sP.resetFilter = true;
          this.navCtrl.setRoot('SearchPage');
        } else {
          //  this.productSearch();
        }

      }
    });
  }

  productSearch() {
    let productModal = this.modalCtrl.create('ProductServicePage');
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
      if (data != 'not selected') {
        this.sP.product_search.search_text = data.Text;
        this.sP.product_text = data.Text;
        if (this.sP.location == '' && this.sP.product_text != '') {
          //   this.locationSearch();
        } else {
          this.toggleState();
        }
      }
    });
  }

  toggleState() {
    console.log(this.state);
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }

  search_tool(status) {
    this.sP.search_tool(status);
  }
  /* search end */
  openRequest(rfqid) {
    this.navCtrl.push('RequestDetailsPage', { param1: rfqid });
  }

}
