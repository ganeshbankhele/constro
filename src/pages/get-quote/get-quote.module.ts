import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetQuotePage } from './get-quote';
import { GetSearchQuoteProvider } from '../../providers/get-search-quote/get-search-quote';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    GetQuotePage,
  ],
  imports: [
    IonicPageModule.forChild(GetQuotePage),PipesModule,DirectivesModule
  ],
  providers:[GetSearchQuoteProvider]
})
export class GetQuotePageModule {}
