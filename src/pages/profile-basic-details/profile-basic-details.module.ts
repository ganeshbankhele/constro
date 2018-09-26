import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileBasicDetailsPage } from './profile-basic-details';

@NgModule({
  declarations: [
    ProfileBasicDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileBasicDetailsPage),
  ],
})
export class ProfileBasicDetailsPageModule {}
