import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyDetailsPage } from './company-details';
import { CommonProvider } from '../../providers/common/common';
import { PipesModule } from '../../pipes/pipes.module'
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    CompanyDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyDetailsPage),PipesModule,ComponentsModule
  ],
  providers:[CommonProvider]
})
export class CompanyDetailsPageModule {}
