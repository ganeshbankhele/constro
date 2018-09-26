import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyVariantPage } from './company-variant';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    CompanyVariantPage,
  ],
  imports: [
    IonicPageModule.forChild(CompanyVariantPage),ComponentsModule
  ],
})
export class CompanyVariantPageModule {}
