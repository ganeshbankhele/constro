import { Component } from '@angular/core';
import { SearchProvider } from '../../providers/search/search';
@Component({
  selector: 'searchbox',
  templateUrl: 'searchbox.html',
  providers: [SearchProvider]
})
export class SearchboxComponent {

  constructor( 
    public searchProvider: SearchProvider
  ) {
   console.log(searchProvider.showSearchbar);
  }
  search_tool(status){
   this.searchProvider.search_tool(status);
  } 
}
