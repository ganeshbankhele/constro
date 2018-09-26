import { Component } from '@angular/core';
import { IonicPage,NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-lead-details',
  templateUrl: 'lead-details.html',
})
export class LeadDetailsPage {
  data:any={};
  constructor(public auth: AuthProvider, public navParams: NavParams) {
    this.data = navParams.get('param1');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeadDetailsPage');
  }

}
