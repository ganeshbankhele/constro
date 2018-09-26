import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BeABasicDetailsPage } from './be-a-basic-details';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    BeABasicDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(BeABasicDetailsPage),
  ],
  providers:[
    CommonProvider
  ]
})
export class BeABasicDetailsPageModule {}
