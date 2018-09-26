import { NgModule } from '@angular/core';
import { SearchboxComponent } from './searchbox/searchbox';
import { IonicModule } from 'ionic-angular';
import { FaIconComponent } from './fa-icon/fa-icon';
import { TabScrollComponent } from './tab-scroll/tab-scroll';
import { ProgressBarComponent } from './progress-bar/progress-bar';

@NgModule({
	declarations: [
		FaIconComponent,
		SearchboxComponent,
    	TabScrollComponent,
    ProgressBarComponent,
    ],
	imports: [IonicModule],
	exports: [
	SearchboxComponent,
    FaIconComponent,
    TabScrollComponent,
    ProgressBarComponent
]
})
export class ComponentsModule {}
