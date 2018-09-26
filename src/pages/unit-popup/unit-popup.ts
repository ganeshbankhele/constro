import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController  } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-unit-popup',
  templateUrl: 'unit-popup.html',
})
export class UnitPopupPage {
data:any;
units:any =[];
  constructor(public navCtrl: NavController,
    public viewCtrl: ViewController,
     public navParams: NavParams) {
     this.units =  this.navParams.get('unit');
     
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnitPopupPage');
  }
  dismiss()
  {
     this.viewCtrl.dismiss(null);
  }
  slected(data)
  {
     this.data = data;
     this.viewCtrl.dismiss(this.data);
  }
}
