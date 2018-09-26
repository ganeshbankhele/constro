import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VariantModelPage } from './variant-model';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    VariantModelPage,
  ],
  imports: [
    IonicPageModule.forChild(VariantModelPage),ComponentsModule
  ],
})
export class VariantModelPageModule {}
