import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubscriptionDetailsPage } from './subscription-details';
import { SubcriptionProvider }  from '../../providers/subcription/subcription';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SubscriptionDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(SubscriptionDetailsPage),ComponentsModule
  ],
  providers:[
    SubcriptionProvider
  ]
})
export class SubscriptionDetailsPageModule {}
