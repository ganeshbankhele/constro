import { Component } from '@angular/core';
import { IonicPage, NavController,Platform,LoadingController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PoProvider } from '../../providers/po/po';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',

})
export class OrderDetailsPage {
  poId;
  showSearchbar:boolean=false;
  postParams:any = { 
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "poId":"",
     "token": "" };
     orderDetails:any;
     poDetail:any ={};
    productDetails:any=[];
  constructor(public navCtrl: NavController,
    public popoverCtrl:PopoverController,
    public authProvider:AuthProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public poProvider: PoProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
       if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
      this.poId = navParams.get('param1');
      this.postParams.poId = this.poId;
      console.log(this.poId);
      this.poDetails();
  }

  ionViewDidLoad(){
    
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  poDetails() {
    const loading = this.loadingCtrl.create({
      content:'Please wait..'
    });
    loading.present();
    this.poProvider.poDetails(this.postParams).then((result) => {
      this.orderDetails = result;
      console.log(this.orderDetails);
      this.poDetail = this.orderDetails.poDetails;
      this.productDetails = this.orderDetails.productDetails;
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

  presentPopover(data,user) {
    this.navCtrl.push('OrderpopoverPage',{details:data,user:user});
  }


  pushPage(page){
    this.navCtrl.push(page);
  }
}
