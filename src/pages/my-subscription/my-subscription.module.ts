import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MySubscriptionPage } from './my-subscription';
import { SubcriptionProvider }  from '../../providers/subcription/subcription';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    MySubscriptionPage,
  ],
  imports: [
    IonicPageModule.forChild(MySubscriptionPage),ComponentsModule
  ],
  providers:[
    SubcriptionProvider
  ]
})
export class MySubscriptionPageModule {}

