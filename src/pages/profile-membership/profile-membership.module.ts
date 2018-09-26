import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileMembershipPage } from './profile-membership';

@NgModule({
  declarations: [
    ProfileMembershipPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileMembershipPage),
  ],
})
export class ProfileMembershipPageModule {}
