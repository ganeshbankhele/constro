import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams,ViewController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
@IonicPage()
@Component({
  selector: 'page-open-filter',
  templateUrl: 'open-filter.html',
})
export class OpenFilterPage {
  title:string;
  dataReceived:any;
  
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
    private ga: GoogleAnalytics,
    public platform: Platform,
     public navParams: NavParams) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.dataReceived = navParams.get('filterdata');

    

  }
  ionViewDidLoad() {
    this.title = this.dataReceived.name;
  }
  setValue(valSet,i){
   if(valSet.applied == false){
    valSet.applied =true;
   }else{
    valSet.applied =false;
   }
  }

  dismiss()
  {
     this.viewCtrl.dismiss();
  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
}
