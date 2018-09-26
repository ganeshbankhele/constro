import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrentLeadsPage } from './current-leads';
import { BuyLeadProvider } from '../../providers/buy-lead/buy-lead';
import { AuthProvider } from '../../providers/auth/auth';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CurrentLeadsPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrentLeadsPage),ComponentsModule
  ],providers:[
    BuyLeadProvider,
    AuthProvider
  ]
})
export class CurrentLeadsPageModule {}
