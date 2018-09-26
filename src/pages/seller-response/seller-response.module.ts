import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellerResponsePage } from './seller-response';
import { RequestProvider } from '../../providers/request/request';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SellerResponsePage,
  ],
  imports: [
    IonicPageModule.forChild(SellerResponsePage),DirectivesModule,ComponentsModule
  ],providers:[RequestProvider]
})
export class SellerResponsePageModule {}
