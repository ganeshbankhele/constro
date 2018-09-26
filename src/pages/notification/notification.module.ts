import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationPage } from './notification';
import { SearchProvider } from '../../providers/search/search';

@NgModule({
  declarations: [
    NotificationPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationPage),
  ], providers: [
    SearchProvider
  ]
})
export class NotificationPageModule {}
