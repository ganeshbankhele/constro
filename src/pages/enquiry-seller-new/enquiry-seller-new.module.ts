import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnquirySellerNewPage } from './enquiry-seller-new';
import { PipesModule } from '../../pipes/pipes.module'
import { EnquiryProvider } from '../../providers/enquiry/enquiry';

@NgModule({
  declarations: [
    EnquirySellerNewPage,
  ],
  imports: [
    IonicPageModule.forChild(EnquirySellerNewPage),PipesModule
  ],
  providers:[
    EnquiryProvider
  ]
})
export class EnquirySellerNewPageModule {}
