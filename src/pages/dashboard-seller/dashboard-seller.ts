import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController,Platform,NavController,MenuController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { DashboardProvider } from '../../providers/dashboard/dashboard';
import { Chart } from 'chart.js';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from "@ionic-native/in-app-browser";
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-dashboard-seller',
  templateUrl: 'dashboard-seller.html',
})
export class DashboardSellerPage {
  @ViewChild('barCanvas') barCanvas;
  @ViewChild('doughnutCanvas') doughnutCanvas;
  barChart: any;
  doughnutChart: any;
  chart_Type: string = 'month';
  requestGraph: boolean = false;
  productGraph: boolean = false;
  public doughnutChartLabels: string[] = ['Active', 'Inactive', 'Under Verification'];
  public doughnutChartType: string = 'doughnut';
  public doughnutChartData: number[];
  session:any={};
  all: any; dashData: any;
  profileCount: number;
  labelsdata = []; RequestsData = []; Responsesdata = [];
  sellerCurrentPackage;
  activeProducts;
  inactiveProducts;
  underVerificationProducts;
  hideShowPieChart;
  totalProductCount;
  sellerProducts:any=[];
  sellerLeads:any=[];
  totalLeadsCount;
  Expiry_Status;
  Expiry_Date;
  Order_Total_Amount;
  BuyLeads;;
  lastLoggedOnDate;
  topBuyers = [];
  totalResponse;
  requestChart;
  requestChartUpdatepro;
  getCompetitor = [];
  currentAppVersion;
  sellerRequestsDetails: any; sellerOrders;
  responseData; dashboardData; totalRequestsCount; sellerRequests; totalOrdersCount; totalOrderPlaced;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sP: SearchProvider,
    public modalCtrl: ModalController,
    public authProvider: AuthProvider,
    public dash: DashboardProvider,
    public menu:MenuController,
    private inAppBrowser: InAppBrowser,    
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public note:NotificationProvider,
    private ga: GoogleAnalytics,
    public alertCtrl: AlertController, ) {
       if (this.platform.is('android') || this.platform.is('ios')) {
         this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Dashboard Seller');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
       }
    if (localStorage.getItem('userType') == 'Seller') {
      this.loadSellerDashboard();
    }else if(localStorage.getItem('userType') == 'Buyer'){
      this.navCtrl.setRoot('DashboardPage');
    }
    else{
      this.navCtrl.setRoot('HomePage');
    }
  }

  ionViewDidLoad() {
   
 
  }

  loadSellerDashboard() {
    let postParams = {
      "User_Id": localStorage.getItem('userId'),
      "User_Type": localStorage.getItem('userType'),
      "Request_From": "App",
      "Token": ""
    };
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.dash.loadSellerDashobard(postParams).then((result) => {
        this.all = result;
        if (this.all.response.status == 'Success') {
          loading.dismiss();

          this.responseData = this.all.response;
          this.dashboardData = this.responseData.responseObject[0];
          this.currentAppVersion = this.dashboardData.currentAppVersion;
          if(this.currentAppVersion > this.authProvider.appVersion){
             let update =  this.dashboardData.messageUpdate;
             this.menu.enable(false);
            this.navCtrl.setRoot('UpdateAppPage',{"updateMessage":update});
          }
          this.profileCount = this.dashboardData.ProfileCount;
          this.activeProducts = this.dashboardData.productDetailsCount.Active_Count;
          this.inactiveProducts = this.dashboardData.productDetailsCount.Inactive_Count;
          this.underVerificationProducts = this.dashboardData.productDetailsCount.UnderVerification_Count;
          if (this.activeProducts == 0 && this.inactiveProducts == 0 && this.underVerificationProducts == 0) {
            this.productGraph = false;
          }
          else {
            this.productGraph = true;
          }
          this.doughnutChartData = [this.activeProducts, this.inactiveProducts, this.underVerificationProducts];
          this.totalProductCount = this.dashboardData.sellerDisplayProducts.totalProductCount.totalProducts;
          this.sellerProducts = this.dashboardData.sellerDisplayProducts.sellerProducts;

          this.sellerLeads = this.dashboardData.sellerLeadsDetails.sellerLeads;
          this.totalLeadsCount = this.dashboardData.sellerLeadsDetails.totalLeadsCount.totalLeads;
          this.sellerOrders = this.dashboardData.sellerOrdersDetails.sellerOrders;
          this.totalOrdersCount = this.dashboardData.sellerOrdersDetails.totalOrdersCount.totalOrders;

          this.totalOrderPlaced = this.dashboardData.sellerOrdersDetails.totalOrderPlaced.OrderPlaced;


          this.sellerRequests = this.dashboardData.sellerRequestsDetails.sellerRequests;
          this.totalRequestsCount = this.dashboardData.sellerRequestsDetails.totalRequestsCount.totalRequests;
          if (this.totalRequestsCount == '0') {
            this.requestGraph = false;
          } else {
            this.requestGraph = true;
          }


          this.labelsdata = this.dashboardData.ChartRequestData.Months;
          this.RequestsData = this.dashboardData.ChartRequestData.Requests;
          this.Responsesdata = this.dashboardData.ChartRequestData.Responses;
          this.sellerCurrentPackage = this.dashboardData.currentSubscription.Package_Name;
          this.Expiry_Status = this.dashboardData.currentSubscription.Expiry_Status;
          this.Expiry_Date = this.dashboardData.currentSubscription.Expiry_Date;
          this.Order_Total_Amount = this.dashboardData.currentSubscription.Order_Total_Amount;
          this.BuyLeads = this.dashboardData.getBuyLeads;
          this.lastLoggedOnDate = this.dashboardData.lastLoggedOn.lastLoggedOnDate;
          this.topBuyers = this.dashboardData.getTopBuyersList;
          this.totalResponse = this.dashboardData.sellerRequestsDetails.totalResponse.totalResponseSent;
          this.getCompetitor = this.dashboardData.getCompetitor;
          if (this.labelsdata.length > 0) {
            this.requestChart = 'block';
            this.requestChartUpdatepro = 'none';
            this.loadSellerGrpha();
          }
          this.loadSellerGrpha();
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

  loadSellerGrpha() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: this.labelsdata,
        datasets: [{
          label: 'Request Received',
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
            'rgba(255,99,132,1)',
          ],
          borderWidth: 1
        },
        {
          label: 'Response Sent',
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

    this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.doughnutChartLabels,
        datasets: [{
          label: '# of Votes',
          data: this.doughnutChartData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',

          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",

          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',

          ],
          borderWidth: 1
        }]
      }

    });
  }

  
  createUser(createUserType) {
    let parameters = {
      "phoneNo": localStorage.getItem('phoneNo'),
      "emailId": localStorage.getItem('emailId'),
      "User_Id": localStorage.getItem('userId'),
      "createAccountFor": createUserType,
      "newcompanyName": "",
      "requestFrom": "App",
      "token": ""
    };
    console.log(createUserType);
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
         
            loading.dismiss();
            this.navCtrl.setRoot('DashboardPage');
         
        }
        else if (this.all.response.status == "fail") {
          loading.dismiss();
          let title = "Switching Failed.";
         
          let Msg = this.all.reasonCode.reasonCode;
          this.presentAlert(title, Msg)
        }
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    });
  }
  openPackage(){
    this.navCtrl.push('SubscriptionDetailsPage');
  }
  openPage(page){
    this.navCtrl.setRoot(page);
  }

  openNotification(page){
     this.navCtrl.push(page);
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
  
    browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
      if (event.url === '') {
        browser.close();
      }
    });
    //Events: loadstart, loadstop, loaderror, exit
    browser.on('exit').subscribe(() => {
      //Do whatever here
    });
  }
}
