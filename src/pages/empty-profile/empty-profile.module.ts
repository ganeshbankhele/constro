import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmptyProfilePage } from './empty-profile';

@NgModule({
  declarations: [
    EmptyProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EmptyProfilePage),
  ],
})
export class EmptyProfilePageModule {}
