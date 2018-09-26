import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileBankdetailsPage } from './profile-bankdetails';

@NgModule({
  declarations: [
    ProfileBankdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileBankdetailsPage),
  ],
})
export class ProfileBankdetailsPageModule {}
