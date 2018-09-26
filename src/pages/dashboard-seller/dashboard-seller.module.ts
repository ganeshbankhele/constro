import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardSellerPage } from './dashboard-seller';
import { ComponentsModule } from '../../components/components.module';
import { DashboardProvider } from '../../providers/dashboard/dashboard';
@NgModule({
  declarations: [
    DashboardSellerPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardSellerPage),ComponentsModule
  ],
  providers: [
    DashboardProvider
  ]
})
export class DashboardSellerPageModule {}
