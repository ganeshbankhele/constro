import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
import { PostRequirementProvider } from '../../providers/post-requirement/post-requirement';

@IonicPage()
@Component({
  selector: 'page-post-req-unit',
  templateUrl: 'post-req-unit.html',
})
export class PostReqUnitPage {
  data:any;
  keyword:string='';
  units:any=[];
   constructor(public navCtrl: NavController,
   public navParams: NavParams,
   public PR: PostRequirementProvider,
   public viewCtrl: ViewController) {
   }
   ionViewDidLoad()
   {
 
   }
  
   updateList(ev){
    this.keyword = ev.target.value;
      let postParams = {
        "keyword": this.keyword,
        "token": "",
        "selectedProd": "",
        "requestFrom": "App",
      };
      this.PR.postRequirementUnits(postParams).then((result) => {
        let res:any = result;
        if(res.response.status=='success'){
          this.units =  res.response.responseListObject.productsUnitslist;
        }
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
   slectedString(dat)
   {
       this.data = { UnitName:dat };
       this.viewCtrl.dismiss(this.data);
   }

}
