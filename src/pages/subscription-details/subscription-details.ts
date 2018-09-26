import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams ,ModalController, LoadingController} from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { SubcriptionProvider }  from '../../providers/subcription/subcription';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-subscription-details',
  templateUrl: 'subscription-details.html',
})
export class SubscriptionDetailsPage {
  @ViewChild(Slides) slides: Slides;
  skipMsg: string = "Skip";
  state: string = 'x';
  postParams:any = { 
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "requestFrom": "App",
    "token": ""
  };
  packages:any=[];
  constructor(public navCtrl: NavController,
  public subscrProvider:SubcriptionProvider,
  public modalCtrl: ModalController,
  private ga: GoogleAnalytics,
  public note:NotificationProvider,
  public platform: Platform,
  public loadingCtrl: LoadingController,
  public authProvider: AuthProvider,
  public navParams: NavParams,) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.packagesDetails();
  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  packagesDetails() {
    const loading = this.loadingCtrl.create({});
    loading.present();
    this.subscrProvider.getPackageList(this.postParams).then((result) => {
      this.packages = result;
      console.log(this.packages);
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }
  slideChanged(){
    
  }
  slideMoved() {
    if (this.slides.getActiveIndex() >= this.slides.getPreviousIndex())
      this.state = 'rightSwipe';
    else
      this.state = 'leftSwipe';
  }


  openPayment(rfqid,selectedMonth){
    
    this.navCtrl.push('BuyPackagePage', { packageId: rfqid,noofmonths:selectedMonth});
  }
  
  monthsChanged(selectedMonth, packageSub) {
    if (selectedMonth == '3') {
      packageSub.selectedMonth=3;
      packageSub.Package_Amount = (packageSub.Actual_Package_Amount * 1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      packageSub.Package_Validity_Days = selectedMonth + ' Months';
    }
    else if (selectedMonth == '6') {
      packageSub.selectedMonth=6;
      packageSub.Package_Amount = (packageSub.Actual_Package_Amount * 2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      packageSub.Package_Validity_Days = selectedMonth + ' Months';
    }
    else if (selectedMonth == '12') {
      packageSub.selectedMonth=12;
      packageSub.Package_Amount = (packageSub.Actual_Package_Amount * 4).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      packageSub.Package_Validity_Days = selectedMonth + ' Months';
    }
  }
 
  
}
