import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSellerPage } from './order-seller';
import { SearchProvider } from '../../providers/search/search';
import { PoProvider } from '../../providers/po/po';
import { PipesModule } from '../../pipes/pipes.module'
@NgModule({
  declarations: [
    OrderSellerPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderSellerPage),PipesModule
  ],
  providers: [
    SearchProvider,PoProvider
  ]
})
export class OrderSellerPageModule {}
