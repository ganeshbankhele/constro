import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PurchasedLeadsPage } from './purchased-leads';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PurchasedLeadsPage,
  ],
  imports: [
    IonicPageModule.forChild(PurchasedLeadsPage),ComponentsModule
  ]
 
})
export class PurchasedLeadsPageModule {}
