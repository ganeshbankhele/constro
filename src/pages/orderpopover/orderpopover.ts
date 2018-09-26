import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-orderpopover',
  templateUrl: 'orderpopover.html',
})
export class OrderpopoverPage {
  details:any={};
  user:string;
  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public viewCtrl: ViewController) 
  {
    this.details = navParams.get('details');
    this.user = navParams.get('user');
  }

  ionViewDidLoad() {
   
  }
  
  
    close() {
      this.viewCtrl.dismiss();
    }

}
