import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PosturrequirementPage } from './posturrequirement';
import { SearchProvider } from '../../providers/search/search';
import { PostRequirementProvider } from '../../providers/post-requirement/post-requirement';

@NgModule({
  declarations: [
    PosturrequirementPage,
  ],imports: [
    IonicPageModule.forChild(PosturrequirementPage),
  ], providers: [
    SearchProvider,
    PostRequirementProvider
  ]
})
export class PosturrequirementPageModule {}
