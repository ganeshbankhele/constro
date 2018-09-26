import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivacypolicyPage } from './privacypolicy';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    PrivacypolicyPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivacypolicyPage),
  ], providers: [
    CommonProvider
  ]
})
export class PrivacypolicyPageModule {}
