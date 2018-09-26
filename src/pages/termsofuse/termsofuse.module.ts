import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TermsofusePage } from './termsofuse';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    TermsofusePage,
  ],
  imports: [
    IonicPageModule.forChild(TermsofusePage),
  ], providers: [
    CommonProvider
  ]
})
export class TermsofusePageModule {}
