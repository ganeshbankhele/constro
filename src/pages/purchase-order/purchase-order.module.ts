import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PurchaseOrderPage } from './purchase-order';
import { RequestProvider } from '../../providers/request/request';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    PurchaseOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(PurchaseOrderPage),DirectivesModule,ComponentsModule
  ],providers:[RequestProvider]
})
export class PurchaseOrderPageModule {}
