import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CatPrdeditPage } from './cat-prdedit';
import { ComponentsModule } from '../../components/components.module';
import { ProductCatelogProvider } from '../../providers/product-catelog/product-catelog';

@NgModule({
  declarations: [
    CatPrdeditPage,
  ],
  imports: [
    IonicPageModule.forChild(CatPrdeditPage),ComponentsModule
  ], providers: [
    ProductCatelogProvider
  ]
})
export class CatPrdeditPageModule {}
