import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePasswordPage } from './change-password';
import { SearchProvider } from '../../providers/search/search';
@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
  ],providers: [
    SearchProvider
  ]
})
export class ChangePasswordPageModule {}
