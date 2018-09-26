import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyLeadPage } from './buy-lead';
import { ComponentsModule } from '../../components/components.module';
import { BuyLeadProvider } from '../../providers/buy-lead/buy-lead';

@NgModule({
  declarations: [
    BuyLeadPage,
  ],
  imports: [
    IonicPageModule.forChild(BuyLeadPage),ComponentsModule
  ],providers:[BuyLeadProvider]
 
})
export class BuyLeadPageModule {}
