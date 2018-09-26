import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, MenuController, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from "@ionic-native/in-app-browser";
import { Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { Subscription } from 'rxjs/Subscription';
import { trigger, state, style, keyframes, animate, transition } from '@angular/animations';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

var navigator;
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
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
export class HomePage {
  session: any = {};
  all: any = {};
  homeData: any = {};
  recommendation: any = [];
  topBrands: any = [];
  latest_launch: any = [];
  innovations: any = [];
  showSlider: boolean = false;
  currentAppVersion;
  public state = 'inactive';

  connected: Subscription;
  disconnected: Subscription;

  constructor(public navCtrl: NavController,
    public sP: SearchProvider,
    public toastCtrl: ToastController,
    public authProvider: AuthProvider,
    private inAppBrowser: InAppBrowser,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public menu: MenuController,
    public platform: Platform,
    private network: Network,
    private spinnerDialog: SpinnerDialog,
    private ga: GoogleAnalytics,
    public modalCtrl: ModalController,
    public navParams: NavParams) {
       this.ga.startTrackerWithId('UA-91262155-1')
       .then(() => {
         this.ga.trackView('Home');
       })
       .catch(e => console.log('Error starting GoogleAnalytics', e));
      if (localStorage.getItem('userType') == 'Buyer') {
        this.navCtrl.setRoot('DashboardPage');
      }else if(localStorage.getItem('userType') == 'Seller'){
        this.navCtrl.setRoot('DashboardSellerPage');
      }else{
        this.loadHomePage();
      }
  }

  ionViewDidEnter() {
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }

  ionViewWillLeave(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }
  
  displayNetworkUpdate(connectionState: string) {
    // let networkType = this.network.type;
    // if(connectionState=='offline'){
    //   this.toastCtrl.create({
    //     message: `You are now ${connectionState}`,
    //     duration: 3000
    //   }).present();
    // }
  }

  loadHomePage() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait..',
      dismissOnPageChange: true
    });
    loading.present().then(() => {
      this.sP.loadHomePage().then((result) => {
        this.all = result;
        if (this.all.response.status == 'success') {
          this.homeData = this.all.response.responseObject[0];
          this.currentAppVersion = this.homeData.currentAppVersion;
          if (this.currentAppVersion > this.authProvider.appVersion) {
            let update = this.homeData.messageUpdate;
            this.menu.enable(false);
            this.navCtrl.setRoot('UpdateAppPage', { "updateMessage": update });
          }
          this.recommendation = this.homeData.recommendations;
          this.topBrands = this.homeData.TopBrands;
          this.latest_launch = this.homeData.latest_launch;
          this.innovations = this.homeData.innovations;
          this.showSlider = true;
          loading.dismiss();
        }
        else if (this.all.response.status == "fail") {
          loading.dismiss();

          let Msg = 'Invalid username or password.';
          this.presentAlert(Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }

  openCompanyPage(catId, subCatId, sellerProductId) {
    this.closeSearchBar();
    let det = { "catId": catId, "subCatId": subCatId, "sellerProductId": sellerProductId }
    this.navCtrl.push('CompanyDetailsPage', { datas: det });
  }

  openBrand(brand){
    this.sP.searchForType ="Brand";
    this.sP.product_search.country_id = "1";
    this.sP.product_search.state_id = "0";
    this.sP.product_search.city_id = "0";
    this.sP.product_search.location_id = "0";
    this.sP.product_search.Location_Name = "India";
    this.sP.product_text = brand;
    this.sP.location = "India";
    this.sP.changeSelect('Brand');
    this.sP.product_search.search_text = brand;
    this.sP.resetFilter = true;
    this.navCtrl.setRoot('SearchPage');
  }

  openChat() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      hardwareback: 'no',
      zoom: 'no'
    }
    // Opening a URL and returning an InAppBrowserObject
    const browser = this.inAppBrowser.create("https://tawk.to/chat/594204c450fd5105d0c811c1/default/?$_tawk_popout=true&$_tawk_sk=5a0ed5a3e192c53f27f6f44b&$_tawk_tk=6161a44ca436c4ae3b0ceca58bf22770&v=570", '_self', options);
    // Inject scripts, css and more with browser.X

    browser.on('loadstart').subscribe((eve) => {
      this.spinnerDialog.show(null, null, true);     
    }, err => {
      this.spinnerDialog.hide();
    })
    
    browser.on('loadstop').subscribe(()=>{
      this.spinnerDialog.hide();
    }, err =>{
      this.spinnerDialog.hide();
    })
    
    browser.on('loaderror').subscribe(()=>{
      this.spinnerDialog.hide();
    }, err =>{
      this.spinnerDialog.hide();
    })
    
    browser.on('exit').subscribe(()=>{
      this.spinnerDialog.hide();
    }, err =>{
      this.spinnerDialog.hide();
    })

    // var ref = window.open(encodeURI('https://tawk.to/chat/594204c450fd5105d0c811c1/default/?$_tawk_popout=true&$_tawk_sk=5a0ed5a3e192c53f27f6f44b&$_tawk_tk=6161a44ca436c4ae3b0ceca58bf22770&v=570'), '_blank', 'location=no');
    // ref.addEventListener('loadstart', inAppBrowserbLoadStart);
    // ref.addEventListener('loadstop', inAppBrowserbLoadStop);
    // ref.addEventListener('loaderror', inAppBrowserbLoadError);
    // ref.addEventListener('exit', inAppBrowserbClose);
    
    
    // function inAppBrowserbLoadStart(event) {
    //    navigator.notification.activityStart("Please Wait", "It'll only take a moment...");
    // }
    
    // function inAppBrowserbLoadStop(event) {
    //    navigator.notification.activityStop();
    // }
    
    // function inAppBrowserbLoadError(event) {
    //    navigator.notification.activityStop();
    // }
    
    // function inAppBrowserbClose(event) {
    //    navigator.notification.activityStop();
    //    ref.removeEventListener('loadstart', inAppBrowserbLoadStart);
    //    ref.removeEventListener('loadstop', inAppBrowserbLoadStop);
    //    ref.removeEventListener('loaderror', inAppBrowserbLoadError);
    //    ref.removeEventListener('exit', inAppBrowserbClose);
    // }
  }
  postRequirement() {
    this.navCtrl.push('PosturrequirementPage');
  }
  getQuote(sellerProductId) {
    if (this.authProvider.userId == '') {
      this.authProvider.loginAs = "Buyer";
      let login = this.modalCtrl.create('LoginSignUpPage');
      login.present({ keyboardClose: false });
      login.onDidDismiss((data) => {
        if (data != null) {
          this.openGetQuote(sellerProductId);
        }
      });
    } else {
      this.openGetQuote(sellerProductId);
    }
  }
  openGetQuote(sellerProductId) {

    let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: sellerProductId, quoteType: 'single' });
    getQuoteModal.present({ keyboardClose: false });
    getQuoteModal.onDidDismiss((data) => {

    });
  }

  presentAlert(Msg) {
    const alert = this.alertCtrl.create({
      subTitle: Msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  ionViewDidLoad() {

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
         // this.locationSearch();
        } else {
          this.toggleState();
        }

      }

    });
  }

  search_tool(status) {
    this.sP.search_tool(status);
  }

  toggleState() {
    this.state = this.state === 'active' ? 'inactive' : 'active';
  }
  /* search end */

  openlogin() {
    let locationModal = this.modalCtrl.create('LoginSignUpPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {

    });
  }
}
