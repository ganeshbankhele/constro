import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
//import { PopoverController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';
import { SliceWordPipe } from '../../pipes/slice-word/slice-word';
//import { AnimationService, AnimationBuilder } from 'css-animator';
import { AuthProvider } from '../../providers/auth/auth';
import { trigger, state, style, keyframes, animate, transition } from '@angular/animations';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';

import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
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
export class SearchPage {
  product_data: any;
  showFilter: boolean = true;
  isShowSubHead: boolean = true;
  noMoreResult: boolean = false;
  noResult: boolean = true;
  title: string;
  filters: any = [];
  selectedCheck: any = [];
  public state = 'inactive';
  constructor(public navCtrl: NavController,
    public navParams: NavParams, private alertCtrl: AlertController,
    public sP: SearchProvider,
    // public db: AngularFireDatabase,
    //  public animationService: AnimationService,
    public actionSheetCtrl: ActionSheetController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public note:NotificationProvider,
    public authProvider: AuthProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    //  public popoverCtrl: PopoverController
  ){

    if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.search();
   
    
  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  ionViewDidLoad() {
    this.title = this.sP.product_search.search_text;
  }

  openCompanyPage(catId, subCatId, sellerProductId) {
    this.closeSearchBar();
    let det = { "catId": catId, "subCatId": subCatId, "sellerProductId": sellerProductId }
    this.navCtrl.push('CompanyDetailsPage', { datas: det });
  }

  getQuotes() {
    this.closeSearchBar();
    if (this.sP.getQuoteids.length > 0) {
      if (this.authProvider.userId == '') {
        this.authProvider.loginAs = "Buyer";
        let login = this.modalCtrl.create('LoginSignUpPage');
        login.present({ keyboardClose: false });
        login.onDidDismiss((data) => {
          if (data != null) {
            this.getQuotes();
          }
        });
      } else {
        // if (!this.authProvider.checkEmailId) {
        //   let emptyProfile = this.modalCtrl.create('EmptyProfilePage');
        //   emptyProfile.present({ keyboardClose: false });
        //   emptyProfile.onDidDismiss((data) => {
        //     if (data != null) {
        //       this.getQuotes();
        //     }
        //   });
        // } else {
        let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: this.sP.getQuoteids, quoteType: 'single' });
        getQuoteModal.present({ keyboardClose: false });
        getQuoteModal.onDidDismiss((data) => {
          if (data == 'request') {
            this.navCtrl.setRoot('RequestPage');
          }
        });
      }
     //  }
    } else {
      this.presentToast('Please Select At Least 1 Product To Get Quote.');
    }
  }

  openFilter() {
    this.closeSearchBar();
    this.navCtrl.push('FilterPage');
  }

  showContact(sellProId) {
    if (this.authProvider.userId == '') {
      this.authProvider.loginAs = "Buyer";
      let login = this.modalCtrl.create('LoginSignUpPage');
      login.present({ keyboardClose: false });
      login.onDidDismiss((data) => {
        if (data != null) {
          this.getContacts(sellProId);
        }
      });
    } else {
      this.getContacts(sellProId);
    }
  }

  getContacts(sellProId) {
    let parameters = {
      "Request_From": "App",
      "User_Id": localStorage.getItem('userId'),
      "User_Type": "Buyer",
      "sellproid": sellProId
    }
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sP.getContact(parameters).then((result) => {
      let res: any = {};
      res = result;
      if (res.response.status == 'Success') {
        let pushNotifications = res.response.responseListObject.pushNotifications
          if (pushNotifications.length > 0) {
            let icntr;
            let today = new Date();
            for (icntr = 0; icntr < pushNotifications.length; icntr++) {
              // this.note.genUserAll = this.db.list('/usernotification/' + pushNotifications[icntr].Seller_Id);              
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
        let rest = res.response.responseListObject;
        let string = "<p class='font-size-1-5'>Contact Person : " + rest.Contact_Person_Name + "</p><p class='font-size-1-5'>Contact Number : " + rest.Contact_Person_Phone + "</p><p class='font-size-1-5'> Email Address : " + rest.Contact_Person_Email + "</p>"
        this.presentAlert(string);
      } else {
        this.presentAlert('Something went wrong, please try again');
      }

    }, (err) => {
      console.log(err);
    });
  }

  presentAlert(string) {
    let alert = this.alertCtrl.create({
      title: 'Get Contact Details',
      subTitle: string,
      buttons: ['Close']
    });
    alert.present();
  }



  addToGetquote(data, i) {
    console.log(data);
    var index = this.sP.getQuoteids.indexOf(data.seller_product_id);
    data.selected = !data.selected;
    if (index > -1) {
      this.sP.getQuoteids.splice(index, 1);
      this.product_data[i].selectedSeller = 0;
    } else {
      this.sP.getQuoteids.push(data.seller_product_id);
      this.product_data[i].selectedSeller = 1;
    }
    console.log(this.sP.getQuoteids)
  }


  moreOption() {
    let actionSheet = this.actionSheetCtrl.create({

      buttons: [
        {
          text: 'Reverse Auction',
          icon: '',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Compare',
          icon: '',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  sortOption() {
    let actionSheet = this.actionSheetCtrl.create({

      buttons: [
        {
          text: 'Reverse Auction',
          icon: '',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Compare',
          icon: '',
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });

    actionSheet.present();
  }

  filter() {
    // const loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // loading.present();
    this.sP.filter().then((result) => {
      this.sP.product_search.filters = [];
      this.sP.selectedFilter= [];
      this.sP.Price = [];
      this.sP.Moq = [];
      this.sP.Other = [];
      this.sP.selectedFilterString = [];
      this.filters = result;
      console.log(this.filters);
      this.sP.cloneFilter123 = result;
      this.sP.Price = this.filters.Price;
      this.sP.Moq = this.filters.Moq;
      this.sP.Other = this.filters.Other;
      this.sP.Other.forEach(element => {
        this.sP.selectedFilterString.push({ "filterName": element.Filter_Name, "note": "" })
      });

      this.sP.priceRangeLower = this.sP.Price.Filter_Min_Value;
      this.sP.priceRangeUpper = this.sP.Price.Filter_Max_Value;
      this.sP.moqRange = this.sP.Moq.Filter_Min_Value;
      // loading.dismiss();
    }, (err) => {
      console.log(err);
    });
  }

  search() {
    if (this.sP.product_search.search_text != '') {
      this.sP.product_search.start_limit = 0;
     
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();


      this.sP.search().then((result) => {
        
        this.product_data = result;
        this.sP.getQuoteids = [];
         
        if (this.product_data.length == 0) {
          this.noResult = false;
          loading.dismiss();
          this.presentToast('No products found');
        }
        else {
          this.sP.resetFilter = false;
          this.isShowSubHead = true;
          this.sP.product_search.start_limit = 25;
          loading.dismiss();
        }
      }, (err) => {
        console.log(err);
      });
      if (this.sP.resetFilter) {
        this.filter();
      }
    } else {
      this.showFilter = false;
      this.presentToast('Please Select Product First.');
    }
  }

  doRefresh(refresher) {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.sP.product_search.start_limit = 0;
    this.sP.search().then((result) => {

      this.product_data = result;
      this.sP.getQuoteids = [];
      this.isShowSubHead = true;
      refresher.complete();
      loading.dismiss();
      this.sP.product_search.start_limit = 25;
    }, (err) => {
      console.log(err);
    });
    refresher.complete();
  }

  doInfinite(infiniteScroll: any) {
    this.sP.search().then((result) => {
      if (Object.keys(result).length == 0) {
        this.noMoreResult = true;
        infiniteScroll.complete();
        this.presentToast('No more products found');

      }
      else {
        for (let i = 0; i < Object.keys(result).length; i++) {
          this.product_data.push(result[i]);

        }
        this.sP.product_search.start_limit = parseInt(this.sP.product_search.start_limit) + 25;

        infiniteScroll.complete();
      }
    }, (err) => {
      console.log(err);
      infiniteScroll.complete();
    });

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
      this.sP.resetFilter = true;
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
         // this.productSearch();
        }

      }
    });
  }

  productSearch() {
    let productModal = this.modalCtrl.create('ProductServicePage');
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
      console.log(data);
      if (data != 'not selected') {
        this.sP.product_search.search_text = data.Text;
        this.sP.product_text = data.Text;
        if (this.sP.location == '' && this.sP.product_text != '') {
        //  this.locationSearch();
        } else {
          this.toggleState();
        }

      }

    });
  }
  showInfo(msg){
    this.presentToast(msg);
  }
  toggleState() {
    console.log(this.state);
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }

  search_tool(status) {
    this.sP.search_tool(status);
  }
  /* search end */

  chkOpen(data, i) {
    if (data.Variant_List.length == 1) {
      this.addToGetquote(data.Variant_List[0], i);
    } else {
      this.presentProfileModal(data.Variant_List, i);
    }
  }

  chkOpenbottom(data, i) {
    if (data.Variant_List.length == 1) {
      var index = this.sP.getQuoteids.indexOf(data.Variant_List[0].seller_product_id);
      if(index > -1){
        this.getQuotes();
      }else{
        this.addToGetquote(data.Variant_List[0], i);
      }
    } else {
      this.presentProfileModal(data.Variant_List, i);
    }
  }
  presentProfileModal(variantData, i) {
    console.log(this.product_data)
    let counts = this.product_data[i].selectedSeller;
    let details = { varData: variantData, count: counts };
    console.log(details);
    let variantModal = this.modalCtrl.create('VariantModelPage', { variant_data: details });
    variantModal.present();
    variantModal.onDidDismiss((data) => {
      if (data != null && data != 'request') {
        this.product_data[i].selectedSeller = data;
        if (data == 0) {
          this.selectedCheck[i] = false;
        } else {
          this.selectedCheck[i] = true;
        }
      } else if (data == 'request') {
        this.navCtrl.setRoot('RequestPage');
      }
    });

  }



  // openGetQuote() {
  //   this.getQuote = {
  //     "seller_product_id": "11825,11984",
  //     "user_id": "931",
  //     "Search_Country_Id": "1",
  //     "Search_City_Id": "334",
  //     "Search_State_Id": "13",
  //     "Search_Location_Id": "0",
  //   };
  //   this.navCtrl.push('GetQuoteEditPage', { "dataForQuote": this.getQuote });
  // }
}

