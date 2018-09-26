import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileAwardsPage } from './profile-awards';

@NgModule({
  declarations: [
    ProfileAwardsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileAwardsPage),
  ],
})
export class ProfileAwardsPageModule {}
