import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams,ModalController, LoadingController } from 'ionic-angular';
import { SubcriptionProvider }  from '../../providers/subcription/subcription';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
@IonicPage()
@Component({
  selector: 'page-my-subscription',
  templateUrl: 'my-subscription.html',
})
export class MySubscriptionPage {
  mySubscriptionDetails:any={}
  subscriptionDetails:any={};
  upgradePackages:any;
  subscriptionFeatures:any=[];
  postParams = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "requestFrom": "App",
    "token": ""
  };
  constructor(public navCtrl: NavController, 
  public navParams: NavParams,
  public subscrProvider:SubcriptionProvider,
  public modalCtrl: ModalController,
  public loadingCtrl: LoadingController,
  private ga: GoogleAnalytics,
  public platform: Platform,
  public authProvider: AuthProvider,) 
  {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.mySubscription();
  }

  mySubscription() {
    const loading = this.loadingCtrl.create({content: 'Please wait..'});
    loading.present();
    this.subscrProvider.mySubscription(this.postParams).then((result) => {
      this.mySubscriptionDetails = result;
      this.subscriptionDetails = this.mySubscriptionDetails.subscriptionDetails[0];
      this.upgradePackages= this.mySubscriptionDetails.upgradePackages;
      this.subscriptionFeatures= this.mySubscriptionDetails.subscriptionFeatures;

      console.log(this.subscriptionFeatures);
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

  openPackage(){
    this.navCtrl.push('SubscriptionDetailsPage');
  }
}
