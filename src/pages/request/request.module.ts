import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestPage } from './request';
import { SearchProvider } from '../../providers/search/search';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module'
import { RequestProvider } from '../../providers/request/request';

@NgModule({
  declarations: [
    RequestPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestPage),ComponentsModule,PipesModule
  ],providers: [
    SearchProvider,RequestProvider
  ]
})
export class RequestPageModule {}
