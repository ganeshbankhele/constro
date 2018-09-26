import { NgModule } from '@angular/core';
import { ArrayFilterPipe } from './array-filter/array-filter';
import { SliceWordPipe } from './slice-word/slice-word';
import { AppliedFilterPipe } from './applied-filter/applied-filter';
import { TruncatecharPipe } from './truncatechar/truncatechar';
@NgModule({
	declarations: [ArrayFilterPipe,
    SliceWordPipe,
    AppliedFilterPipe,
    TruncatecharPipe,
    ],
	imports: [],
	exports: [ArrayFilterPipe,
    SliceWordPipe,
    AppliedFilterPipe,
    TruncatecharPipe,
    ]
})
export class PipesModule {}
