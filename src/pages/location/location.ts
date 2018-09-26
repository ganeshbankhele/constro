import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController  } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
 data:any;
 keyword:string;
 locations:any;
  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  public searchServiceProvider:SearchProvider,
  public viewCtrl: ViewController) {
  }
  ionViewDidLoad()
  {

  }
 
  updateList(ev) {
    this.keyword = ev.target.value;
    this.searchServiceProvider.searchLocation(this.keyword).then((result) => {
        this.locations=result;
        console.log(this.locations);
      }, (err) => {
      console.log(err);
    });
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
