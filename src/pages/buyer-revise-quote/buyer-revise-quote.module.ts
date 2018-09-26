import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuyerReviseQuotePage } from './buyer-revise-quote';
import { RequestProvider } from '../../providers/request/request';
import { DigitOnlyDirective } from '../../directives/digit-only/digit-only';
import { DirectivesModule } from '../../directives/directives.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    BuyerReviseQuotePage,DigitOnlyDirective,
  ],
  imports: [
    IonicPageModule.forChild(BuyerReviseQuotePage),DirectivesModule,ComponentsModule 
  ],providers:[RequestProvider]
})
export class BuyerReviseQuotePageModule {}
