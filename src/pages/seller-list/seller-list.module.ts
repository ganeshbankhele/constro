import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerListPage } from './seller-list';

@NgModule({
  declarations: [
    SellerListPage,
  ],
  imports: [
    IonicPageModule.forChild(SellerListPage),
  ],
})
export class SellerListPageModule {}
