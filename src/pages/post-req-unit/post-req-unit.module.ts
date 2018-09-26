import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostReqUnitPage } from './post-req-unit';
import { PostRequirementProvider } from '../../providers/post-requirement/post-requirement';

@NgModule({
  declarations: [
    PostReqUnitPage,
  ],
  imports: [
    IonicPageModule.forChild(PostReqUnitPage),
  ], providers: [
        PostRequirementProvider
  ]
})
export class PostReqUnitPageModule {}
