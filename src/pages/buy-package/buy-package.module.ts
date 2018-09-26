import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyPackagePage } from './buy-package';
import { SubcriptionProvider }  from '../../providers/subcription/subcription';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    BuyPackagePage,
  ],
  imports: [
    IonicPageModule.forChild(BuyPackagePage),ComponentsModule
  ],
  providers:[SubcriptionProvider]
})
export class BuyPackagePageModule {}
