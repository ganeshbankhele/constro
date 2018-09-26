import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterPage } from './filter';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    FilterPage
  ],
  imports: [
    IonicPageModule.forChild(FilterPage),PipesModule,ComponentsModule
  ], providers: [
    
  ]
})
export class FilterPageModule {}
