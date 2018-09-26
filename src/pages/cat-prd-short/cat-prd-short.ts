import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular'

@IonicPage()
@Component({
  selector: 'page-cat-prd-short',
  templateUrl: 'cat-prd-short.html',
})
export class CatPrdShortPage {
cat_short_data:any=[
  {
    "product_name":"Architectural and structural designing Service 300MM x 600MM Dark Matt Finish",
    "product_image":"assets/imgs/95.jpg",
    "order_qty":"21 Ton",
    "price_range":"2500 to 3500"
  },
  {
    "product_name":"Architectural and structural designing Service 300MM x 600MM Dark Matt Finish",
    "product_image":"assets/imgs/95.jpg",
    "order_qty":"21 Ton",
    "price_range":"2500 to 3500"
  },
  {
    "product_name":"Architectural and structural designing Service 300MM x 600MM Dark Matt Finish",
    "product_image":"assets/imgs/95.jpg",
    "order_qty":"21 Ton",
    "price_range":"2500 to 3500"
  }
];
  constructor(
    public navCtrl: NavController,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
   
  }
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Catlog 1 Option',
      buttons: [
        {
          text: 'Edit',
          icon:"create",
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Delete',
          icon:"trash",
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Copy',
          icon:"copy",
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Create New Catalog',
          icon:"add",
          handler: () => {
            console.log('Archive clicked');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          icon:"close",
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  pushPage(page){
    this.navCtrl.push(page);
  }
}
