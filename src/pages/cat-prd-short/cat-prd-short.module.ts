import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CatPrdShortPage } from './cat-prd-short';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CatPrdShortPage,
  ],
  imports: [
    IonicPageModule.forChild(CatPrdShortPage),ComponentsModule
  ]
})
export class CatPrdShortPageModule {}
