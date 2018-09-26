import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestHistoryPage } from './request-history';
import { SearchProvider } from '../../providers/search/search';
import { ComponentsModule } from '../../components/components.module';
import { RequestProvider } from '../../providers/request/request';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    RequestHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestHistoryPage),ComponentsModule,PipesModule
  ],providers: [
    SearchProvider,RequestProvider
  ]
})
export class RequestHistoryPageModule {}
