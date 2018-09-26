import { Component } from '@angular/core';
import { IonicPage, NavController,Platform,LoadingController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { PoProvider } from '../../providers/po/po';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
@IonicPage()
@Component({
  selector: 'page-order-seller-details',
  templateUrl: 'order-seller-details.html',
})
export class OrderSellerDetailsPage {
  poId;
  showSearchbar:boolean=false;
  postParams:any = { 
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "poId":"",
     "token": "" };
    
     orderDetails:any;
     oaSuccess
     poDetail:any ={};
    productDetails:any=[];
  constructor(public navCtrl: NavController,
    public popoverCtrl:PopoverController,
    public authProvider:AuthProvider,
    public poProvider: PoProvider,
    private ga: GoogleAnalytics,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    public platform: Platform,
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
      
     
      this.poSellerDetails();
  }

  ionViewDidLoad(){
    
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  poSellerDetails() {
    const loading = this.loadingCtrl.create({
      content:'Please wait..'
    });
    loading.present();
    this.poProvider.poDetails(this.postParams).then((result) => {
      this.orderDetails = result;
     
      this.poDetail = this.orderDetails.poDetails;
      this.productDetails = this.orderDetails.productDetails;
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

  confirmOrder(){
    const loading = this.loadingCtrl.create({
      content:'Please wait..'
    });
    loading.present();
    this.poProvider.submitOA(this.postParams).then((result) => {
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
      this.navCtrl.setRoot('OrderSellerPage');
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
