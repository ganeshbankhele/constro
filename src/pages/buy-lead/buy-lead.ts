
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,  Platform } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { BuyLeadProvider } from '../../providers/buy-lead/buy-lead';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-buy-lead',
  templateUrl: 'buy-lead.html',
})
export class BuyLeadPage {


currentRoot: any = 'CurrentLeadsPage';
purchasedRoot: any = 'PurchasedLeadsPage';

tabsColor: string = "default";
tabsMode: string = "md";
tabsPlacement: string = "top";

tabToShow: Array<boolean> = [true, true];
scrollableTabsopts: any = {};
   constructor(
    public navCtrl: NavController, 
    public platform: Platform,
    public bl:BuyLeadProvider,
    public navParams: NavParams, 
    private ga: GoogleAnalytics,
    private toastCtrl: ToastController
    ){

     if (this.platform.is('android') || this.platform.is('ios')) {
         this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Buy Lead');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
       }
  }


refreshScrollbarTabs() {
  this.scrollableTabsopts = { refresh: true };    
}

presentChangeOrendationToast() {
  let toast = this.toastCtrl.create({
    message: 'Rotate screen to rerendering.',
    duration: 2000,
    position: 'middle'
  });

  toast.onDidDismiss(() => {
  
  });

  toast.present();
}

 

  pushPage(page) {
    this.navCtrl.push(page);
  }
}
