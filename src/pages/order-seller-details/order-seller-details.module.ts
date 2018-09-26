import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSellerDetailsPage } from './order-seller-details';
import { SearchProvider } from '../../providers/search/search';
import { PoProvider } from '../../providers/po/po';
import { PipesModule } from '../../pipes/pipes.module'
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    OrderSellerDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSellerDetailsPage),ComponentsModule,PipesModule
  ],
  providers: [
    SearchProvider,PoProvider
  ]
})
export class OrderSellerDetailsPageModule {}
