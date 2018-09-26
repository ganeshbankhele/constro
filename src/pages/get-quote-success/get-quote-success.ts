import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
//import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-get-quote-success',
  templateUrl: 'get-quote-success.html',
})
export class GetQuoteSuccessPage {
  successDetails:any=[];
  constructor(public navCtrl: NavController,
   // private alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
      this.successDetails = this.navParams.get('data');
      console.log(this.successDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetQuoteSuccessPage');
  }
  viewRequest(){
    this.viewCtrl.dismiss('request');
    
  }
  close()
  {
    this.viewCtrl.dismiss(null);
    
  }
}
