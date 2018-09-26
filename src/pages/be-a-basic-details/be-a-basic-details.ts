import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ViewController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonProvider } from '../../providers/common/common';
import { AuthProvider } from '../../providers/auth/auth';

@IonicPage()
@Component({
  selector: 'page-be-a-basic-details',
  templateUrl: 'be-a-basic-details.html',
})
export class BeABasicDetailsPage {
  beABuyer: boolean = false;
  beABuyerStage1: boolean = false;
  beABuyerStage2: boolean = false;
  buyerStage1SubmitAttempt: boolean = false;
  buyerStage2SubmitAttempt: boolean = false;
  beASeller: boolean = false;
  beASellerStage1: boolean = false;
  beASellerStage2: boolean = false;
  sellerStage1SubmitAttempt: boolean = false;
  sellerStage2SubmitAttempt: boolean = false;
  sellerStage2;
  buyerType: string;
  showComp: boolean = false;
  addedUserDetails: any;
  buyerComp;
  createtype;
  isCompanyDetailsvailabel;
  isUserDetailsvailabel;
  sellerStage1;
  buyerStage1;
  buyerStage2;

  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public CommProvider: CommonProvider,
    public alertCtrl: AlertController,
    public viewCtrl: ViewController,
    public authProvider: AuthProvider,
    public navParams: NavParams) {
    this.createtype = this.navParams.get('userType');
    this.isCompanyDetailsvailabel = localStorage.getItem('isCompanyDetailsvailabel');
    this.isUserDetailsvailabel = localStorage.getItem('isUserDetailsvailabel');

    this.sellerStage1 = formBuilder.group({
      fullName: ['', Validators.required],
      buyerType: ['', Validators.required],
      cfullName: ['']
    });

    this.sellerStage2 = formBuilder.group({
      cfullName: ['']
    });

    this.buyerStage1 = formBuilder.group({
      fullName: ['', Validators.required],
      cfullName: ['', Validators.required]
    });

    this.buyerStage2 = formBuilder.group({
      buyerbType: ['', Validators.required],
      cfullName: ['']
    });
  }

  ionViewDidLoad() {
    if (this.isCompanyDetailsvailabel == 'No'
      && this.isUserDetailsvailabel == 'No'
      && this.createtype == 'Seller') {
      this.beASeller = true;
      this.beASellerStage1 = true;
    }else if(this.isCompanyDetailsvailabel == 'Yes'
    && this.isUserDetailsvailabel == 'Yes'
    && this.createtype == 'Seller'){
      this.buyerComp = localStorage.getItem('companyName');
      this.beASeller = true;
      this.beASellerStage2 = true;
    }
     else if (this.isCompanyDetailsvailabel == 'No'
      && this.isUserDetailsvailabel == 'No'
      && this.createtype == 'Buyer') {
      this.beABuyer = true;
      this.beABuyerStage1 = true;
    }else if(this.isCompanyDetailsvailabel == 'Yes'
    && this.isUserDetailsvailabel == 'Yes'
    && this.createtype == 'Buyer'){
      this.buyerComp = localStorage.getItem('companyName');
      this.beABuyer = true;
      this.beABuyerStage2 = true;
    }
  }

  changeType(value) {
    this.sellerStage1.get('buyerType').setValue(value)
    var cfullName = this.sellerStage1.get('cfullName');
    if (value == 'Company') {
      this.showComp = true;
      if(cfullName.value==''){
       cfullName.setErrors({ 'isRequred': true });
      }
   } else {
     this.showComp = false;
     if (cfullName.hasError['isRequred'] == true) {
       cfullName.setErrors({ 'isRequred': null });
     }
   }

   
  }

  sellerStage1Submit() {
    var cfullName = this.sellerStage1.get('cfullName');
    var bType = this.sellerStage1.get('buyerType');
    if(cfullName.value.trim()=='' && bType.value=='Company'){
       cfullName.setErrors({ 'isRequred': true });
     }
    this.sellerStage1SubmitAttempt = true;
    if (!this.sellerStage1.valid) {
     
    }
    else {
      
      let postParams = {
        iamindividual: this.sellerStage1.get('buyerType').value,
        requestFrom: "App",
        token: "",
        userCompany: this.sellerStage1.get('cfullName').value,
        userFullName: this.sellerStage1.get('fullName').value,
        userId: localStorage.getItem('userId')
      }
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.CommProvider.addBasicDetails(postParams).then((result) => {
          let all: any = result;
          if (all.response.status == 'Success') {
            loading.dismiss();
            this.beASellerStage1 = false;
            this.beASellerStage2 = true;
            if (this.sellerStage1.get('cfullName').value != '') {
              
              this.buyerComp = this.sellerStage1.get('cfullName').value
            } else {

              this.buyerComp = this.sellerStage1.get('fullName').value
            }

            // this.addedUserDetails = all.response.responseObject.productResults;
          } else {
            loading.dismiss();
          }
        }, (err) => {
          loading.dismiss();
        
        });
      });
    }
  }




  sellerStage2Submit() {
    if (!this.sellerStage2.valid) {
      
    }
    else {
      let comp = this.sellerStage2.get('cfullName').value;
      
      this.createUser(this.createtype, comp, 'No')
    }
  }

  buyerStage1Submit() {
    this.buyerStage1SubmitAttempt = true;
    if (!this.buyerStage1.valid) {
     
    }
    else {
     
      let postParams = {
        iamindividual: "No",
        requestFrom: "App",
        token: "",
        userCompany: this.buyerStage1.get('cfullName').value,
        userFullName: this.buyerStage1.get('fullName').value,
        userId: localStorage.getItem('userId')
      }
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.CommProvider.addBasicDetails(postParams).then((result) => {
          let all: any = result;
          if (all.response.status == 'Success') {
            loading.dismiss();
            this.beABuyerStage1 = false;
            this.beABuyerStage2 = true;
            this.buyerComp = this.buyerStage1.get('cfullName').value
          } else {
            loading.dismiss();
          }
        }, (err) => {
          loading.dismiss();
        });
      });
    }
  }

  changeType2(value) {
    this.buyerStage2.get('buyerbType').setValue(value)
    var cfullName = this.buyerStage2.get('cfullName');
    if (value == 'Company') {
       this.showComp = true;
      //  if(cfullName.value==''){
      //   cfullName.setErrors({ 'isRequred': true });
      //  }
    } else {
      this.showComp = false;
      // if (cfullName.hasError['isRequred'] == true) {
      //   cfullName.setErrors({ 'isRequred': null });
      // }
    }
  }

  buyerStage2Submit() {
    this.buyerStage2SubmitAttempt = true;
    if (!this.buyerStage2.valid) {
      
    }
    else {
      let comp = this.buyerStage2.get('cfullName').value;
      let indiv = this.buyerStage2.get('buyerbType').value;
      let buTpe = 'Yes';
      if (indiv == 'Company') {
        buTpe = 'No';
      }
     
      this.createUser(this.createtype, comp, buTpe)
    }
  }
  createUser(createUserType, compName, indiv) {
    let parameters = {
      "phoneNo": this.authProvider.phoneNo,
      "emailId": this.authProvider.emailId,
      "userType": this.authProvider.userType,
      "createAccountFor": createUserType,
      "newcompanyName": compName,
      "iamindividual": indiv,
      "requestFrom": "App",
      "token": ""
    };
    
    const loading = this.loadingCtrl.create({
      content: 'Creating account for ' + createUserType
    });
    loading.present().then(() => {
      this.authProvider.createNewAccount(parameters).then((result) => {
        let all: any = result;
        if (all.response.status == 'Success') {
          loading.dismiss();
          this.viewCtrl.dismiss(this.createtype)
        }
        else if (all.response.status == "fail") {
          loading.dismiss();
          let Msg = "Something went wrong. please try after sometime.";
          this.presentAlert('', Msg)
          this.viewCtrl.dismiss(null);
        }
      }, (err) => {
        
        loading.dismiss();
      });
    });
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
