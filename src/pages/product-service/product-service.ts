import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController  } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';


@IonicPage()
@Component({
  selector: 'page-product-service',
  templateUrl: 'product-service.html',
})
export class ProductServicePage {
  data:any;
  keyword:string='';
  product:any=[];
  constructor(public navCtrl: NavController,
    public searchServiceProvider:SearchProvider,
      public viewCtrl: ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }
  updateList(ev) {
    this.keyword = ev.target.value;
    this.searchServiceProvider.product(this.keyword).then((result) => {
        this.product= result;
        console.log(this.product);
      }, (err) => {
        console.log('error');
      console.log(err.message);
    });
  }

  dismiss()
  {
    this.viewCtrl.dismiss('not selected');
  }

  slected(data)
  {
      this.data = data;
      this.viewCtrl.dismiss(this.data);
  }
  slectedString(dat)
  {
      this.data = { "Text": dat };
      this.viewCtrl.dismiss(this.data);
  }
}
