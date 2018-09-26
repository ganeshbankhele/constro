import { Component, ViewChild } from '@angular/core';
import { IonicPage, Platform, ModalController, NavController, MenuController, ToastController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { DashboardProvider } from '../../providers/dashboard/dashboard';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { trigger, state, style, keyframes, animate, transition } from '@angular/animations';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from "@ionic-native/in-app-browser";
import { NotificationProvider } from '../../providers/notification/notification'

var navigator;
@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
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

export class DashboardPage {
  @ViewChild('barCanvas') barCanvas;
  barChart: any;
  chart_Type: string = 'month';
  session: any = {};
  all: any; dashData: any;
  recommendation = [];
  innovations = [];
  latest_launch = [];
  topBrands = [];
  TotalRequestCount = '0';
  TotalEnquiryCount;
  TotalOrderCount;
  request: any = [];
  orders = [];
  enquiry = [];
  labelsdata = []; RequestsData: any = []; Responsesdata = [];
  userType = 'Seller';
  currentAppVersion;
  profileCount; requestGraph: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sP: SearchProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public platform: Platform,
    private inAppBrowser: InAppBrowser,
    public menu: MenuController,
    public dash: DashboardProvider,
    public note: NotificationProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private ga: GoogleAnalytics,
  ) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Dashboard Buyer');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    if (localStorage.getItem('userType') == 'Buyer') {
      this.loadBuyerDashboard();
    } else if (localStorage.getItem('userType') == 'Seller') {
      this.navCtrl.setRoot('DashboardSellerPage');
    }
    else {
      this.navCtrl.setRoot('HomePage');
    }
  }

  openNotification(page) {
    this.navCtrl.push(page);
  }

  loadBuyerDashboard() {
    let postParams = {
      "User_Id": localStorage.getItem('userId'),
      "User_Type": localStorage.getItem('userType'),
      "Request_From": "App",
      "Token": ""
    };
    const loading = this.loadingCtrl.create({
      content: 'Please wait..',

    });
    loading.present().then(() => {
      this.dash.loadBuyerDashobard(postParams).then((result) => {
        this.all = result;

        if (this.all.response.status == 'Success') {
          loading.dismiss();
          this.dashData = this.all.response.responseObject[0];
          this.currentAppVersion = this.dashData.currentAppVersion;
          if (this.currentAppVersion > this.authProvider.appVersion) {
            let update = this.dashData.messageUpdate;
            this.menu.enable(false);
            this.navCtrl.setRoot('UpdateAppPage', { "updateMessage": update });
          }
          this.profileCount = this.dashData.ProfileCount;
          //  = this.all.response.responseObject[0].TotalRequestCount.totalRequestsCount;
          this.TotalEnquiryCount = this.all.response.responseObject[0].TotalEnquiryCount;
          this.TotalOrderCount = this.all.response.responseObject[0].TotalOrderCount;
          this.request = this.all.response.responseObject[0].request;
          console.log(this.request);
          this.TotalRequestCount = this.request.length;
          console.log(this.TotalRequestCount);
          this.orders = this.all.response.responseObject[0].orders;
          this.enquiry = this.all.response.responseObject[0].enquiry;
          this.recommendation = this.all.response.responseObject[0].recommendations;
          this.innovations = this.all.response.responseObject[0].innovations;
          this.latest_launch = this.all.response.responseObject[0].latest_launch;
          this.topBrands = this.all.response.responseObject[0].TopBrands;
          this.labelsdata = this.all.response.responseObject[0].ChartRequestData.Months;
          this.RequestsData = this.all.response.responseObject[0].ChartRequestData.Requests;

          this.Responsesdata = this.all.response.responseObject[0].ChartRequestData.Responses;
          if (this.TotalRequestCount == '0') {
            this.requestGraph = false;
          } else {
            this.requestGraph = true;
          }

          this.loadBuyerGrpha();
        }
        else if (this.all.response.status == 'fail') {
          loading.dismiss();
          let title = "Sending Failed.";
          let Msg = this.all.reasonCode.reasonCode;
          this.presentAlert(title, Msg)
        }
      }, (err) => {
        console.log(err);
      });
    });
  }



  presentAlert(title, Msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: Msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }


  /* getQuote modal open */
  openGetQuote(sellerProductId) {
    let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: sellerProductId, quoteType: 'single' });
    getQuoteModal.present({ keyboardClose: false });
    getQuoteModal.onDidDismiss((data) => {

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
      this.sP.product_search.filters = [];
      this.navCtrl.setRoot('SearchPage');
    } else {
      this.presentToast('Please Fill Product And Location To Search');
    }
  }

  openChat() {
    // const options: InAppBrowserOptions = {
    //   location: 'no',
    //   clearcache: 'yes',
    //   hardwareback: 'no',
    //   zoom: 'no'
    // }
    // // Opening a URL and returning an InAppBrowserObject
    // const browser = this.inAppBrowser.create("https://tawk.to/chat/594204c450fd5105d0c811c1/default/?$_tawk_popout=true&$_tawk_sk=5a0ed5a3e192c53f27f6f44b&$_tawk_tk=6161a44ca436c4ae3b0ceca58bf22770&v=570", '_self', options);
    // // Inject scripts, css and more with browser.X

    // browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
    //   if (event.url === '') {
    //     browser.close();
    //   }
    // });
    // //Events: loadstart, loadstop, loaderror, exit
    // browser.on('exit').subscribe(() => {
    //   //Do whatever here
    // });

    var ref = window.open(encodeURI('https://tawk.to/chat/594204c450fd5105d0c811c1/default/?$_tawk_popout=true&$_tawk_sk=5a0ed5a3e192c53f27f6f44b&$_tawk_tk=6161a44ca436c4ae3b0ceca58bf22770&v=570'), '_blank', 'location=yes');
    ref.addEventListener('loadstart', inAppBrowserbLoadStart);
    ref.addEventListener('loadstop', inAppBrowserbLoadStop);
    ref.addEventListener('loaderror', inAppBrowserbLoadError);
    ref.addEventListener('exit', inAppBrowserbClose);

    function inAppBrowserbLoadStart(event) {
      navigator.notification.activityStart("Please Wait", "It'll only take a moment...");
    }

    function inAppBrowserbLoadStop(event) {
      navigator.notification.activityStop();
    }

    function inAppBrowserbLoadError(event) {
      navigator.notification.activityStop();
    }

    function inAppBrowserbClose(event) {
      navigator.notification.activityStop();
      ref.removeEventListener('loadstart', inAppBrowserbLoadStart);
      ref.removeEventListener('loadstop', inAppBrowserbLoadStop);
      ref.removeEventListener('loaderror', inAppBrowserbLoadError);
      ref.removeEventListener('exit', inAppBrowserbClose);
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

  openCompanyPage(catId, subCatId, sellerProductId) {
    this.closeSearchBar();
    let det = { "catId": catId, "subCatId": subCatId, "sellerProductId": sellerProductId }
    this.navCtrl.push('CompanyDetailsPage', { datas: det });
  }

  openBrand(brand) {
    this.sP.searchForType = "Brand";
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

  productSearch() {
    let productModal = this.modalCtrl.create('ProductServicePage');
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
      if (data != null) {
        this.sP.product_search.search_text = data.Text;
        this.sP.product_text = data.Text;
        if (this.sP.location == '' && this.sP.product_text == '') {
          //   this.locationSearch();
        }

      }

    });
  }

  search_tool(status) {
    this.sP.search_tool(status);
  }
  /* search end */

  openDetails(id) {
    this.pushPage('OrderDetailsPage');
  }
  pushPage(page) {
    this.navCtrl.push(page);
  }
  changeSelect(line: string) {
    this.chart_Type = line;
  }


  loadBuyerGrpha() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: this.labelsdata,
        datasets: [{
          label: 'Request',
          data: this.RequestsData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255,99,132,1)',
            'rgba(255, 99, 132, 0.2)',
          ],
          borderWidth: 1
        },
        {
          label: 'Response',
          data: this.Responsesdata,
          backgroundColor: [
            'rgba(54, 162, 255, 0.2)',
            'rgba(54, 162, 255, 0.2)',
            'rgba(54, 162, 255, 0.2)',
            'rgba(54, 162, 255, 0.2)',
            'rgba(54, 162, 255, 0.2)',
            'rgba(54, 162, 255, 0.2)',
          ],
          borderColor: [
            'rgba(54, 162, 255, 1)',
            'rgba(54, 162, 255, 1)',
            'rgba(54, 162, 255, 1)',
            'rgba(54, 162, 255, 1)',
            'rgba(54, 162, 255, 1)',
            'rgba(54, 162, 255, 1)',
          ],
          borderWidth: 1
        },
        ]
      },
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [{ stacked: true }],

        },
        legend: {
          display: true,
          // position: "right",
          labels: {
            // fontFamily: "Comic Sans MS",
            boxWidth: 20,
            boxHeight: 2,
            padding: 17
          }
        }
      }

    });

  }

  openlogin() {
    let locationModal = this.modalCtrl.create('LoginSignUpPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
    });
  }

  createUser(createUserType) {
    let parameters = {
      "phoneNo": localStorage.getItem('phoneNo'),
      "emailId": localStorage.getItem('emailId'),
      "User_Id": localStorage.getItem('userId'),
      "User_Type": createUserType,
      "newcompanyName": "",
      "requestFrom": "App",
      "token": ""
    };

    const loading = this.loadingCtrl.create({
      content: 'Creating account for ' + createUserType
    });
    loading.present().then(() => {
      this.authProvider.createNewAccount(parameters).then((result) => {
        this.all = result;
        if (this.all.response.status == 'Success') {
          loading.dismiss();
          this.switchUser(createUserType);
        }
        else if (this.all.response.status == "fail") {
          loading.dismiss();
          //  this.authProvider.changeDetect();
          let Msg = "Creating account failed. please try after sometime.";
          this.presentAlert('', Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }

  switchUser(logtousertype) {
    let parameters = {
      "phoneNo": this.authProvider.phoneNo,
      "emailId": this.authProvider.emailId,
      "userType": logtousertype,
      "requestFrom": "App",
      "token": ""
    };

    const loading = this.loadingCtrl.create({
      content: 'Switching to ' + logtousertype
    });
    loading.present().then(() => {
      this.authProvider.setUserDetails(parameters).then((result) => {
        this.all = result;
        if (this.all.response.status == 'Success') {
          // this.authProvider.changeDetect().then((result) => {
          loading.dismiss();
          this.navCtrl.setRoot('DashboardSellerPage');
          // });
        }
        else if (this.all.response.status == "fail") {
          loading.dismiss();
          let title = "Switching Failed.";
          // this.authProvider.changeDetect();
          let Msg = this.all.reasonCode.reasonCode;
          this.presentAlert(title, Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });

  }
  postRequirement() {
    this.navCtrl.push('PosturrequirementPage');
  }
  openPage(page) {
    this.navCtrl.setRoot(page);
  }
}
