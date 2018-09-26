import { Component } from '@angular/core';
import { IonicPage, NavController,ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../validators/emailValidator';

@IonicPage()
@Component({
  selector: 'page-empty-profile',
  templateUrl: 'empty-profile.html',
})
export class EmptyProfilePage {
  buyerType:string;
  emptyProfile;
  emptyProfileSubmitAttempt:boolean = false;
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
    public alertCtrl: AlertController, 
    public authProvider: AuthProvider,
    public viewCtrl: ViewController,
  public navParams: NavParams) {
    this.emptyProfile = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.compose([EmailValidator.isValid])],
      buyerType: ['', Validators.required],
      cfullName: ['']
      });
  }

  changeType(value){
    this.emptyProfile.get('buyerType').setValue(value)
    var cfullName = this.emptyProfile.get('cfullName');
    if(value=='Company'){
       cfullName.setErrors({ 'isRequred': true });
    }else{
       // if (cfullName.hasError['isRequred'] == false) {
        cfullName.setErrors({ 'isRequred': null });
     // }
    }
  }

  saveDetails(){
    this.emptyProfileSubmitAttempt = true;
    if (!this.emptyProfile.valid) {
      console.log('invalid');
    }
    else {
      console.log(this.emptyProfile.value);
    }  
  }

  back(){
    this.viewCtrl.dismiss(null);
  }
}
