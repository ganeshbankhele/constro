import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationCompanyPage } from './location-company';

@NgModule({
  declarations: [
    LocationCompanyPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationCompanyPage),
  ],
})
export class LocationCompanyPageModule {}
