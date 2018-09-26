import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileCompanyDetailsPage } from './profile-company-details';
@NgModule({
  declarations: [
    ProfileCompanyDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileCompanyDetailsPage),
  ]
})
export class ProfileCompanyDetailsPageModule {}
