import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';

/**
 * Generated class for the SellerListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-seller-list',
  templateUrl: 'seller-list.html',
})
export class SellerListPage {
  sellerList:any= {};
  constructor(public navCtrl: NavController,
    public viewCtrl:ViewController,
     public navParams: NavParams) {
     let list = navParams.get('data');
     this.sellerList = list.split(',');
     console.log(this.sellerList);
  }

  ionViewDidLoad() {
   
  }
  dismiss(){
    this.viewCtrl.dismiss();
  }
}
