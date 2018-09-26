import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SearchProvider } from "../../providers/search/search";

@IonicPage()
@Component({
  selector: 'page-location-company',
  templateUrl: 'location-company.html',
})
export class LocationCompanyPage {
  data: any
  keyword: string;
  locations: any;
  constructor(public navCtrl: NavController,
    public searchServiceProvider: SearchProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {

  }
  updateList(ev) {
    this.keyword = ev.target.value;
    this.searchServiceProvider.searchCompanyLocation(this.keyword).then((result) => {
      this.locations = result;
      console.log(this.locations);
    }, (err) => {
      console.log(err);
    });
  }

  dismiss() {
    this.viewCtrl.dismiss(null);
  }
  slected(data) {
    this.data = data;
    this.viewCtrl.dismiss(this.data);
  }

}
