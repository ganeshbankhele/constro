import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateAppPage } from './update-app';
import { Market } from '@ionic-native/market';

@NgModule({
  declarations: [
    UpdateAppPage,
  ],imports: [
    IonicPageModule.forChild(UpdateAppPage),
  ],providers:[
    Market
  ]
})
export class UpdateAppPageModule {}
