import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutusPage } from './aboutus';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    AboutusPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutusPage),
  ], providers: [
    CommonProvider
  ]
})
export class AboutusPageModule {}
