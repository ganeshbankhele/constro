import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderPage } from './order';
import { PoProvider } from '../../providers/po/po';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    OrderPage
  ],
  imports: [
    IonicPageModule.forChild(OrderPage),PipesModule
  ],
  providers: [
    PoProvider
  ]
})
export class OrderPageModule {}
