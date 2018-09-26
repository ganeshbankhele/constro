import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module'
//import { AnimationService, AnimatesDirective } from 'css-animator';

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),ComponentsModule,PipesModule,
  ],providers:[]
 
})
export class SearchPageModule {}
