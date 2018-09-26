import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnquiryNewPage } from './enquiry-new';
import { PipesModule } from '../../pipes/pipes.module'
import { EnquiryProvider } from '../../providers/enquiry/enquiry';

@NgModule({
  declarations: [
    EnquiryNewPage,
  ],
  imports: [
    IonicPageModule.forChild(EnquiryNewPage),PipesModule
  ],
  providers:[
    EnquiryProvider
  ]
})
export class EnquiryNewPageModule {}
