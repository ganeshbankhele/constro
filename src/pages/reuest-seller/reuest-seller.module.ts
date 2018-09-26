import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReuestSellerPage } from './reuest-seller';
import { SearchProvider } from '../../providers/search/search';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module'
import { RequestProvider } from '../../providers/request/request';

@NgModule({
  declarations: [
    ReuestSellerPage,
  ],imports: [
    IonicPageModule.forChild(ReuestSellerPage),ComponentsModule,PipesModule
  ],providers: [
    SearchProvider,RequestProvider
  ]
})
export class ReuestSellerPageModule {}
