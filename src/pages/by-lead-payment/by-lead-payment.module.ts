import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ByLeadPaymentPage } from './by-lead-payment';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    ByLeadPaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(ByLeadPaymentPage),ComponentsModule
  ]
 
})
export class ByLeadPaymentPageModule {}
