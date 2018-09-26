import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestDetailsPage } from './request-details';
import { SearchProvider } from '../../providers/search/search';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module'
import { RequestProvider } from '../../providers/request/request';

@NgModule({
  declarations: [
    RequestDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestDetailsPage),ComponentsModule,PipesModule
  ],providers: [
    SearchProvider,RequestProvider
  ]
})
export class RequestDetailsPageModule {}
