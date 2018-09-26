import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReuestSellerDetailsPage } from './reuest-seller-details';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module'
import { RequestProvider } from '../../providers/request/request';
import { PoProvider } from '../../providers/po/po';
import { HideFabDirective } from "../../directives/hide-fab/hide-fab";

@NgModule({
  declarations: [
    ReuestSellerDetailsPage,HideFabDirective
  ],
  imports: [
    IonicPageModule.forChild(ReuestSellerDetailsPage),ComponentsModule,PipesModule
  ],
  providers:[RequestProvider,PoProvider]
})
export class ReuestSellerDetailsPageModule {}
