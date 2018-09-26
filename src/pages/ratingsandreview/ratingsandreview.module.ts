import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingsandreviewPage } from './ratingsandreview';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    RatingsandreviewPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingsandreviewPage),ComponentsModule
  ],
})
export class RatingsandreviewPageModule {}
