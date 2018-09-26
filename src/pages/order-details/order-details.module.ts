import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderDetailsPage } from './order-details';
import { PoProvider } from '../../providers/po/po';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    OrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetailsPage),ComponentsModule
  ],
  providers: [
    PoProvider
  ]
})
export class OrderDetailsPageModule {}
