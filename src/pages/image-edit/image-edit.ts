import { Component,/*trigger, state, style, transition, animate, keyframes*/} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonProvider } from '../../providers/common/common';
@IonicPage()
@Component({
  selector: 'page-image-edit',
  templateUrl: 'image-edit.html', 
})
export class ImageEditPage {
  data:any;
  images:any;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public commn:CommonProvider,
    public authProvider:AuthProvider){
    this.data = this.navParams.get('data');
    this.images = this.data; 
  }

  ionViewDidLoad(){
   
  }
  
  deleteImage(imgId){
    let postParams={
      Image_Id:imgId,
      User_Id:localStorage.getItem('userId'),
      Requset_From:'App',
      image_type:'CompanyPhotos'    
  }
    const loading = this.loadingCtrl.create({
      content: 'Deleting...'
    });
    loading.present().then(() => {
      this.commn.deleteImage(postParams).then((result) => {
        var deleted:any = result;
        if (deleted.response.status == 'Success') {
          loading.dismiss();
        }
        else if (deleted.response.status == 'fail') {
          loading.dismiss();
          let Msg = deleted.reasonCode.reasonCode;
          this.presentAlert('',Msg)
        }
      }, (err) => {
        console.log(err);
      });
    });

  }

  presentConfirm(imgId) {
    let alert = this.alertCtrl.create({
     // title: 'Do You ',
      message: 'Do you want to delete this image',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
           
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteImage(imgId)
          }
        }
      ]
    });
    alert.present();
  }

  presentAlert(title, Msg) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: Msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }
 
}
