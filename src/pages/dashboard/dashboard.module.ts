import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DashboardPage } from './dashboard';
import { ComponentsModule } from '../../components/components.module';
import { DashboardProvider } from '../../providers/dashboard/dashboard';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),ComponentsModule,PipesModule
  ],
  providers: [
    DashboardProvider
  ],
 
})
export class DashboardPageModule {}
