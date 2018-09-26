import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyShopPage } from './my-shop';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    MyShopPage,
  ],
  imports: [
    IonicPageModule.forChild(MyShopPage),
  ],providers:[
    CommonProvider
  ]
})
export class MyShopPageModule {}
