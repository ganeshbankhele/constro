import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CatlogPage } from './catlog';
import { ComponentsModule } from '../../components/components.module';
import { ProductCatelogProvider } from '../../providers/product-catelog/product-catelog';

@NgModule({
  declarations: [
    CatlogPage,
  ],
  imports: [
    IonicPageModule.forChild(CatlogPage),ComponentsModule
  ], providers: [
    ProductCatelogProvider
  ]
})
export class CatlogPageModule {}
