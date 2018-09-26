import { Component } from '@angular/core';
import { IonicPage, NavController,Platform,LoadingController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'
import { ProductCatelogProvider } from '../../providers/product-catelog/product-catelog';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'

@IonicPage()
@Component({
  selector: 'page-catlog',
  templateUrl: 'catlog.html',
})
export class CatlogPage {
  noProduct:boolean =false;
  all: any={};
  imagesData: any;
  catShortData: any;
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams,
    public note:NotificationProvider,
    public authProvider: AuthProvider,
    public proServ: ProductCatelogProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public loadingCtrl: LoadingController, ) {

       if (this.platform.is('android') || this.platform.is('ios')) {
         this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Products/Services');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
       }
  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  ionViewDidLoad() {
    
    let postParams = {
      "userId": localStorage.getItem('userId'),
      "userType": localStorage.getItem('userType'),
      "startLimit": 0,
      "noOfRecords": 20,
      "requestFrom": "App",
      "token": ""
    };
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.proServ.getProServices(postParams).then((result) => {
        this.all = result;
        
        if (this.all.response.status == 'Success') {
          loading.dismiss();
          this.catShortData = this.all.response.responseObject.productResults;
        } else {
          this.noProduct=true;
          loading.dismiss();
        }
      }, (err) => {
        loading.dismiss();
        console.log(err);
      });
    });
  }

  updateproduct(event, sellerProductId) {
    let isAvailable = '0';
    if (event.checked == true) {
      isAvailable = '1';
    }
    if (sellerProductId == 0 || sellerProductId == '') {
      return false;
    }
    if (this.authProvider.userId != '' && this.authProvider.userId != null) {
      let parameters = {
        "userId": this.authProvider.userId,
        "isAvailable": isAvailable,
        "updateId": sellerProductId,
        "userType": this.authProvider.userType,
        "requestFrom": "App",
        "token": ""
      };
      this.proServ.updateProServicesStatus(parameters).then(data => {
        this.all = data;
        if (this.all.response.status == 'Success') {
         
        }
      }, err => {
          console.log(err);
      });
    }
  }


  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      // title: 'Catlog 1 Option',
      buttons: [
      //  {
      //    text: 'Edit',
      //    icon: "create",
      //    role: 'destructive',
      //    handler: () => {
      //      this.navCtrl.push('CatPrdeditPage');
      //    }
      //   },
        // {
        //   text: 'Delete',
        //   icon: "trash",
        //   handler: () => {
        //     console.log('Archive clicked');
        //   }
        // },
        // {
        //   text: 'Copy',
        //   icon: "copy",
        //   handler: () => {
        //     console.log('Archive clicked');
        //   }
        // },
     //   {
     //     text: 'Cancel',
     //     role: 'cancel',
     //     icon: "close",
     //     handler: () => {
    //        console.log('Cancel clicked');
     //     }
    //    }
      ]
    });

    actionSheet.present();
  }

  pushPage(page) {
    this.navCtrl.push(page);
  }

  openImage(url, id) {
    this.imagesData = {
      url: url,
      id: id
    }
    this.navCtrl.push('ImageEditPage', { "data": this.imagesData });
  }

  addNewProduct(){
    
  }
}
