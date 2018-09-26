import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LeadDetailsPage } from './lead-details';

@NgModule({
  declarations: [
    LeadDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LeadDetailsPage),
  ],
})
export class LeadDetailsPageModule {}
