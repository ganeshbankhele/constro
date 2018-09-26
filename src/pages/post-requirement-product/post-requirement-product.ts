import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController  } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';


@IonicPage()
@Component({
  selector: 'page-post-requirement-product',
  templateUrl: 'post-requirement-product.html',
})
export class PostRequirementProductPage {
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
    this.searchServiceProvider.postRequireproduct(this.keyword).then((result) => {
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
      this.data = { productName: dat, variantName: "", Product_Id: 0};
      this.viewCtrl.dismiss(this.data);
  }
}
