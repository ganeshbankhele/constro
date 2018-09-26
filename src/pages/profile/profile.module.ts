import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilePage } from './profile';
import { ComponentsModule } from '../../components/components.module';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    ProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ProfilePage),ComponentsModule
  ],providers:[
    CommonProvider
  ]
})
export class ProfilePageModule {}
