import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController,AlertController,NavParams } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
@IonicPage()
@Component({
  selector: 'page-my-shop',
  templateUrl: 'my-shop.html',
})
export class MyShopPage {
compId;userid;
compDetails:any = {
  companyId:"",
  companyuserId:"",
  requestFrom:"App",
  token:"",
  userId:localStorage.getItem('userId'),
  userType:localStorage.getItem('userType')
}
sellerDetails:any = {
  companyuserId:"",
  noOfRecords:12,
  requestFrom:"",
  startLimit:0,
  token:"",
  userId:localStorage.getItem('userId'),
  userType:localStorage.getItem('userType')
}

  constructor(public navCtrl: NavController,
    public loadingCtrl:LoadingController,
    public copro:CommonProvider,
    public alertCtrl:AlertController,
    public navParams: NavParams) {
      let reqdata = this.navParams.get('data');
      this.compDetails.companyId = reqdata.userId;
      this.compDetails.companyuserId = reqdata.compId
  }

  ionViewDidLoad(){
    this.companyDetails();
    this.sellerDatail();
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
  
  companyDetails(){
    const loading = this.loadingCtrl.create({ content: 'Please wait..' });
    loading.present();
    this.copro.companyDetailsMyShop(this.compDetails).then((result) => {
      let dresult: any = result;
      if (dresult.response.status == 'Success') {
         loading.dismiss();
      } else {
        this.presentAlert('Something Went Wrong, Please Try After Sometime.')
        loading.dismiss();
      }
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

  sellerDatail(){
    const loading = this.loadingCtrl.create({ content: 'Please wait..' });
    loading.present();
    this.copro.sellerDetailsMyShop(this.sellerDetails).then((result) => {
      let dresult: any = result;
      if (dresult.response.status == 'Success') {
         loading.dismiss();
      } else {
        this.presentAlert('Something Went Wrong, Please Try After Sometime.')
        loading.dismiss();
      }
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }

}
