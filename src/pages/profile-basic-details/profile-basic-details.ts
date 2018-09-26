import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
// import { DatePicker } from '@ionic-native/date-picker';
import { ProfileProvider } from '../../providers/profile/profile';



@IonicPage()
@Component({
  selector: 'page-profile-basic-details',
  templateUrl: 'profile-basic-details.html',
})
export class ProfileBasicDetailsPage {

  data: any;
  basicForm;
  isEmail: boolean = false;
  fNameEdit: boolean = true;
  MNameEdit: boolean = true;
  LNameEdit: boolean = true;
  bTypeEdit: boolean = true;
  cNameEdit: boolean = true;
  dob: boolean = true;
  modeType = "Edit";
  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    // private datePicker: DatePicker,
    public loadingCtrl: LoadingController,
    public authProvider: AuthProvider,
    public profile: ProfileProvider,
    public navParams: NavParams) {
    this.data = this.navParams.get('data');
    if (this.data.emailId != '') {
      this.isEmail = true;
    }
    this.basicForm = formBuilder.group({
      emailId: [this.data.emailId],
      mobileNo: [this.data.mobileNo],
      companyFullName: [this.data.companyFullName,Validators.maxLength(500)],
      DOB: [this.data.DOB],
      fName: [this.data.fName],
    });


  }

  editMode() {
    if (this.modeType == 'Edit') {
      this.modeType = "Done";
      this.fNameEdit = false;
      this.MNameEdit = false;
      this.LNameEdit = false;
      this.bTypeEdit = false;
      this.cNameEdit = false;
      this.dob = false;

    } else {
      this.modeType = "Edit";
      this.fNameEdit = true;
      this.MNameEdit = true;
      this.LNameEdit = true;
      this.bTypeEdit = true;
      this.cNameEdit = true;
      this.dob = true;
      // this.submitBasicDetails();
    }

  }

  datePic() {
    // this.datePicker.show({
    //   date: new Date(),
    //   mode: 'date',
    //   androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    // }).then((date) =>{
    //   console.log('Got date: ', date);
    //   this.basicForm.get('DOB').setValue(date);
    // });

  }

  cancel() {
    this.navCtrl.push('ProfilePage');
  }

  submitBasicDetails() {

    if (!this.basicForm.valid) {

    } else {
      let parameter = {
        "CountryCode": "+91",
        "DOB": this.basicForm.value.DOB,
        "User_Id": localStorage.getItem('userId'),
        "User_Type": localStorage.getItem('userType'),
        "companyFullName": this.basicForm.value.companyFullName,
        "emailId": this.basicForm.value.emailId,
        "fullName": this.basicForm.value.fName,
        "IsCompany": true,
        "mobileNo": this.basicForm.value.mobileNo
      }
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.profile.basicDetailsUpdate(parameter).then((result) => {
          let all: any = result;
          if (all.response.status == 'Success') {
            let postParams = {
              "User_Id": localStorage.getItem('userId'),
              "User_Type": localStorage.getItem('userType'),
              "token": ""
            };
            this.profile.loadProfile(postParams).then((res) => { });
            loading.dismiss();
            this.navCtrl.setRoot('ProfilePage');
          } else {
            loading.dismiss();
          }
        }, (err) => {
          console.log(err);
          loading.dismiss();
        });
      });
    }
  }
}
