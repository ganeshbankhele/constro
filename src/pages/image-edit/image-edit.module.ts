import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageEditPage } from './image-edit';
import { CommonProvider } from '../../providers/common/common';

@NgModule({
  declarations: [
    ImageEditPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageEditPage),
  ],
  providers:[CommonProvider]
})
export class ImageEditPageModule {}
