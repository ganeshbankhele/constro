import { Component } from '@angular/core';
import { IonicPage, ModalController,Platform, NavController, LoadingController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { PoProvider } from '../../providers/po/po';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-order-seller',
  templateUrl: 'order-seller.html',
})
export class OrderSellerPage {
  noOrders: boolean = false;
  showSearchbar: boolean = false;
  orders: any = [];
  all:any;responseobj:any;
  noMoreResult:boolean=false;
  postParams:any = { 
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "noOfRecords":20,
    "startLimit":0, 
    "token": "" };
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public sP: SearchProvider,
    public note:NotificationProvider,
    public authProvider: AuthProvider,
    public poProvider: PoProvider
  ){
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.poSellerHead();
  }

  ionViewDidLoad() {

  }

  openNotification(page){
    this.navCtrl.push(page);
 }

 
  poSellerHead() {
    const loading = this.loadingCtrl.create({ content:'Please wait..'});
    loading.present();
    this.poProvider.poSellerheader(this.postParams).then((result) => {
      this.orders = result;
      if(this.orders.length==0){this.noOrders = true;}
      this.postParams.startLimit = 20;
      console.log(this.orders);
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

  doRefresh(refresher) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.postParams.startLimit = 0;
    this.poProvider.poSellerheader(this.postParams).then((result) => {
      this.orders = result;
      this.noMoreResult =false;
      this.postParams.startLimit = 20;
     loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
    refresher.complete();
  }

  doInfinite(infiniteScroll: any) {
    this.poProvider.poSellerheader(this.postParams).then((result) => {
      if (Object.keys(result).length == 0) {
        this.noMoreResult = true;
        infiniteScroll.complete();
        //this.presentToast('No more products found');
      }
      else {
        for (let i = 0; i < Object.keys(result).length; i++) {
          this.orders.push(result[i]);
        }
        this.postParams.startLimit = parseInt(this.postParams.startLimit) + 20;
        infiniteScroll.complete();
      }
    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });

  }

  /* search logic */
  locationSearch() {
    let locationModal = this.modalCtrl.create('LocationPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      this.sP.location = data.Location;
      this.sP.product_search.country_id = data.Country_Id;
      this.sP.product_search.state_id = data.State_Id;
      this.sP.product_search.city_id = data.City_Id;
      this.sP.product_search.location_id = data.Country_Id;
      this.sP.product_search.Location_Name = data.Location;
      this.sP.showSearchbar = false;
      this.navCtrl.setRoot('SearchPage');
    });
  }

  productSearch() {
    let productModal = this.modalCtrl.create('ProductServicePage');
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
      this.sP.product_search.search_text = data.Seller_Product;
      this.sP.product_text = data.Seller_Product;
      this.locationSearch();
    });
  }
  search_tool(status) {
    this.sP.search_tool(status);
  }
  /* search end */
 
  openDetails(poNo){
    this.navCtrl.push('OrderSellerDetailsPage', { param1: poNo});
  }

}
