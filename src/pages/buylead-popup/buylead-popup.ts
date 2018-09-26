import { Component } from '@angular/core';
import { IonicPage,ViewController, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-buylead-popup',
  templateUrl: 'buylead-popup.html',
})
export class BuyleadPopupPage {
  constructor(public viewCtrl: ViewController) {}
    close() {
      this.viewCtrl.dismiss();
    }
}
