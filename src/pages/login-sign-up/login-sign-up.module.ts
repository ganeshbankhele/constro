import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginSignUpPage } from './login-sign-up';
import { SearchProvider } from '../../providers/search/search';

@NgModule({
  declarations: [
    LoginSignUpPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginSignUpPage),
  ],providers: [
    SearchProvider
  ]
})
export class LoginSignUpPageModule {}
