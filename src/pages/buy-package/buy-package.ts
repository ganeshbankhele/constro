import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, AlertController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { SubcriptionProvider } from '../../providers/subcription/subcription';
import { AuthProvider } from '../../providers/auth/auth';
import { Validators, FormBuilder } from '@angular/forms';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { GstValidator } from '../validators/gstValidator';
import { GoogleAnalytics } from '@ionic-native/google-analytics';


@IonicPage()
@Component({
  selector: 'page-buy-package',
  templateUrl: 'buy-package.html',
})
export class BuyPackagePage {
  packageId: string;
  noofmonths: string;
  all;
  surl: string;
  furl: string;
  paymentString: string;
  responseData;
  package: any = {};
  packageFeature;
  PaymentForm;
  isMaharashtra = true;
  GST: any = 0;
  iGST: any = 0;
  cGST: any = 0;
  sGST: any = 0;
  txnId: any = 0;
  beforeSuccess: boolean = true;
  afterSuccess: boolean = false;
  paymentDissplayMessage: any = {};
  totalPackageAmount: number = 0;
  actualPackageAmount: any = 0;
  paymentSubmit = false;
  userDetailsAvailable;
  userCompanyAvailable;
  userGSTNo;
  stateCode;
  paymentSubmitForm;
  payUMoneyForm;
  userStateStatus: string = '';
  payumoneyFormUrl;
  companyFullName: string = '';
  userFullName: string = '';
  companyFullNamef: boolean = false;
  userFullNamef: boolean = false;
  dataR: any = {};
  stateError: boolean = true;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public subscrProvider: SubcriptionProvider,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private iab: InAppBrowser,
    private ga: GoogleAnalytics,
    private toastCtrl: ToastController,
    public platform: Platform,
    public authProvider: AuthProvider) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.ga.startTrackerWithId('UA-91262155-1')
        .then(() => {
          this.ga.trackView('Buy Subscription');
        })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
    }
    this.packageId = this.navParams.get('packageId');
    this.noofmonths = (this.navParams.get('noofmonths'));
    this.PaymentForm = formBuilder.group({
      userState: [''],
      userGSTNumber: [''],
      userCompanyName: ['', Validators.required],
      userFullName: ['', Validators.required],
      userStateNo: ['']
    },
      {
        validator: GstValidator.MatchGST // your validation method
      });

    this.getSinglePackage();
  }

  openTerms() {
    this.navCtrl.push('TermsPaymentPage');
  }
  ionViewDidLoad() {

  }
  pay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      hardwareback: 'no',
      zoom: 'no'
    }
    const browser = this.iab.create(this.paymentString, "_self", options);
    browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
      if (event.url === this.surl) {
        browser.close();
        this.submitLeadDetails();
      } else if (event.url === this.furl) {
        browser.close();
        this.submitLeadDetails();
      }
    });
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  presentAlert(title, msg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  paymentSuccess() {
    this.presentAlert('Success', 'You have subcribed successfully.');
  }

  paymentFailure() {
    this.presentAlert('Failuer', 'Something went wrong, please try again.');
  }

  monthsChanged(selectedMonth) {
    console.log(selectedMonth);

    if (selectedMonth == '3') {
      this.package.Package_Amount = (this.actualPackageAmount * 1);
    }
    else if (selectedMonth == '6') {
      this.package.Package_Amount = (this.actualPackageAmount * 2);
    }
    else if (selectedMonth == '12') {
      this.package.Package_Amount = (this.actualPackageAmount * 4);
    }
    if (selectedMonth != '' && selectedMonth > 0) {
      this.noofmonths = selectedMonth;
    }
    if (this.package.Package_Amount > 0) {
      this.iGST = parseFloat(this.package.Package_Amount) * 0.18;
      this.cGST = parseFloat(this.package.Package_Amount) * 0.09;
      this.sGST = parseFloat(this.package.Package_Amount) * 0.09;
      this.totalPackageAmount = parseFloat(this.package.Package_Amount) + parseFloat(this.iGST);
    }
  }

  getSinglePackage() {
    let parameters;
    if (this.authProvider.userId != '' && this.authProvider.userId != null) {
      parameters = {
        "userId": localStorage.getItem('userId'),
        "userType": localStorage.getItem('userType'),
        "packageId": this.packageId,
        "requestFrom": "App",
        "token": ""
      };

      this.subscrProvider.getSinglePackage(parameters).then(data => {
        this.all = data;
        if (this.all.response.status == 'Success') {
          this.responseData = this.all.response.responseObject;
          if (this.responseData.Status == 'Success') {
            this.package = this.responseData.package.packageDetails;
            this.packageFeature = this.responseData.package.packageFeatures;
            this.actualPackageAmount = this.package.Package_Amount;
            this.GST = parseFloat(this.package.Package_Amount) * 0.18;
            this.iGST = parseFloat(this.package.Package_Amount) * 0.18;
            this.cGST = parseFloat(this.package.Package_Amount) * 0.09;
            this.sGST = parseFloat(this.package.Package_Amount) * 0.09;
            this.totalPackageAmount = parseFloat(this.package.Package_Amount) + parseFloat(this.iGST);
            this.userDetailsAvailable = this.responseData.userProfileReadiness.userDetailsAvailable;
            this.companyFullName = this.responseData.userProfileReadiness.companyFullName;
            if (this.companyFullName != '') { this.companyFullNamef = true; }
            this.userFullName = this.responseData.userProfileReadiness.userFullName;
            if (this.userFullName != '') { this.userFullNamef = true; }
            this.userCompanyAvailable = this.responseData.userProfileReadiness.userCompanyAvailable;
            this.userGSTNo = this.responseData.userProfileReadiness.userGSTNo;
            this.stateCode = this.responseData.userProfileReadiness.stateCode;
            if (this.stateCode != '' && this.stateCode != '27') {
              this.isMaharashtra = false;
            }
            this.PaymentForm.get('userFullName').setValue(this.userFullName);
            this.PaymentForm.get('userCompanyName').setValue(this.companyFullName);
            this.PaymentForm.get('userGSTNumber').setValue(this.userGSTNo);
            this.PaymentForm.get('userStateNo').setValue(this.stateCode);


            this.options.filter((item) => {
              if (item.stateId == this.stateCode) {
                this.PaymentForm.get('userState').setValue(item.stateName);
                this.userStateStatus = item.stateName;

              }
            });
            this.monthsChanged(this.noofmonths);
          }
          else {
          }
        }
      }, err => {
      });
    }

  }

  stateSelect() {
    let locationModal = this.modalCtrl.create('StateCodePage', { data: this.options });
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      if (data != null) {
        this.PaymentForm.get('userState').setValue(data.stateName);
        this.userStateStatus = data.stateName;
        this.PaymentForm.get('userStateNo').setValue(data.stateId);
        if (data.stateId != '' && data.stateId != '27') {
          this.isMaharashtra = false;
        } else {
          this.isMaharashtra = true;
        }

      }
    });
  }



  gstValidator() {
    //let userStateNo = this.PaymentForm.controls['userStateNo'].value;
    let userState = this.PaymentForm.controls['userGSTNumber'].value;
    if (userState == '') {
      this.PaymentForm.get('userState').setValue('');
      this.userStateStatus = "";
    }
    let getfirsttwochar = userState.substring(0, 2);
    if (getfirsttwochar != '27') {
      this.isMaharashtra = false;
    } else {
      this.isMaharashtra = true;
    }

    this.options.filter((item) => {
      if (item.stateId == getfirsttwochar) {
        this.PaymentForm.get('userState').setValue(item.stateName);
        this.userStateStatus = item.stateName;
      }
    });

    // if(userStateNo!=getfirsttwochar){
    //   this.PaymentForm.get('userGSTNumber').setErrors( {MatchGST: true});
    //   this.stateError = true;
    // }else{

    //   this.stateError = false;
    // }
  }


  stateChanged(val) {
    alert();
    this.PaymentForm.get('userGSTNumber').reset();
    if (val.value != '27') {
      this.isMaharashtra = false;
    }
    else {
      this.isMaharashtra = true;
    }
    if (val.value.stateName == '') {
      this.isMaharashtra = true;
    }
  }

  options = [
    { 'stateId': "35", "stateName": "Andaman and Nicobar Islands" },
    { 'stateId': "37", "stateName": "Andhra Pradesh" },
    { 'stateId': "12", "stateName": "Arunachal Pradesh" },
    { 'stateId': "18", "stateName": "Assam" },
    { 'stateId': "10", "stateName": "Bihar" },
    { 'stateId': "04", "stateName": "Chandigarh" },
    { 'stateId': "22", "stateName": "Chhattisgarh" },
    { 'stateId': "26", "stateName": "Dadra and Nagar Haveli" },
    { 'stateId': "25", "stateName": "Daman and Diu" },
    { 'stateId': "07", "stateName": "Delhi" },
    { 'stateId': "30", "stateName": "Goa" },
    { 'stateId': "24", "stateName": "Gujarat" },
    { 'stateId': "06", "stateName": "Haryana" },
    { 'stateId': "02", "stateName": "Himachal Pradesh" },
    { 'stateId': "01", "stateName": "Jammu and Kashmir" },
    { 'stateId': "20", "stateName": "Jharkhand" },
    { 'stateId': "29", "stateName": "Karnataka" },
    { 'stateId': "32", "stateName": "Kerala" },
    { 'stateId': "31", "stateName": "Lakshadweep" },
    { 'stateId': "23", "stateName": "Madhya Pradesh" },
    { 'stateId': "27", "stateName": "Maharashtra" },
    { 'stateId': "14", "stateName": "Manipur" },
    { 'stateId': "17", "stateName": "Meghalaya" },
    { 'stateId': "15", "stateName": "Mizoram" },
    { 'stateId': "13", "stateName": "Nagaland" },
    { 'stateId': "21", "stateName": "Odisha" },
    { 'stateId': "97", "stateName": "Other Territory" },
    { 'stateId': "34", "stateName": "Puducherry" },
    { 'stateId': "03", "stateName": "Punjab" },
    { 'stateId': "08", "stateName": "Rajasthan" },
    { 'stateId': "11", "stateName": "Sikkim" },
    { 'stateId': "33", "stateName": "Tamil Nadu" },
    { 'stateId': "36", "stateName": "Telangana" },
    { 'stateId': "16", "stateName": "Tripura" },
    { 'stateId': "09", "stateName": "Uttar Pradesh" },
    { 'stateId': "05", "stateName": "Uttarakhand" },
    { 'stateId': "19", "stateName": "West Bengal" }
  ];




  onSubmitForm() {

    this.paymentSubmit = true;
    if (!this.PaymentForm.controls['userGSTNumber'].valid) {
      let toast = this.toastCtrl.create({
        message: '* GST Number should be of 15 characters.\n * 3rd to 5th characters in GST No. should be alphabets.\n* 6th character of GST No. should be account holders category i.e(P,F,C,H,A,T,G,L,J,G) \n* 7th character in GST No. should be alphabet.',
        duration: 5000,
        showCloseButton: true,
        closeButtonText: 'Got it!',
        position: 'top',
        cssClass: 'changeToast'
      });
      toast.present();
    }

    



    else {

      let userCompany = this.PaymentForm.controls['userCompanyName'].value;
      let userName = this.PaymentForm.controls['userFullName'].value;
      let userState = this.PaymentForm.controls['userStateNo'].value;
      let userGSTNumber = this.PaymentForm.controls['userGSTNumber'].value;
      if (this.authProvider.userId != '' && this.authProvider.userId != null) {
        let parameters = {
          "userId": this.authProvider.userId,
          "userType": this.authProvider.userType,
          "packageId": this.packageId,
          "stateId": userState,
          "noOfMonths": this.noofmonths,
          "userGST": userGSTNumber,
          "userCompany": userCompany,
          "userName": userName,
          "requestFrom": "App",
          "isreferralincluded": "No",
          "token": ""
        };
        this.subscrProvider.submitPackageDetails(parameters).then(data => {
          this.all = data;
          if (this.all.response.status == 'Success') {
            this.responseData = this.all.response.responseObject;
            if (this.responseData.Status == 'Success') {
              this.surl = this.responseData.formData.surl;
              this.furl = this.responseData.formData.furl;
              this.txnId = this.responseData.formData.txnid;
              this.paymentString = `
                <html>
                  <body>
                    <form action="${this.responseData.formData.actionURL}" method="post" id="payu_form">
                      <input type="hidden" name="key" value="${this.responseData.formData.key}"/>
                      <input type="hidden" name="hash" value="${this.responseData.formData.hash}"/>
                      <input type="hidden" name="txnid" value="${this.responseData.formData.txnid}"/>
                      <input type="hidden" name="amount" value="${this.responseData.formData.amount}"/>
                      <input type="hidden" name="firstname" value="${this.responseData.formData.firstname}"/>
                      <input type="hidden" name="lastname" value="${this.responseData.formData.firstname}"/>
                      <input type="hidden" name="email" value="${this.responseData.formData.email}"/>
                      <input type="hidden" name="phone" value="${this.responseData.formData.phone}"/>
                      <input type="hidden" name="productinfo" value="${this.responseData.formData.productinfo}"/>
                      <input type="hidden" name="service_provider" value="${this.responseData.formData.service_provider}"/>
                      <input type="hidden" name="surl" value="${this.surl}"/>
                      <input type="hidden" name="furl" value="${this.furl}"/>
                      <input type="hidden" name="udf1"  value="${this.responseData.formData.udf1}" size="64" />
                      <button type="submit" value="submit" #submitBtn></button>
                    </form>
                    <script type="text/javascript">document.getElementById("payu_form").submit();</script>
                  </body>
                </html>`;
              this.paymentString = 'data:text/html;base64,' + btoa(this.paymentString);
              this.pay();

              //alert('pay');
            }
            else {

            }
          }
          else {

          }
        }, err => {

        });
      }

    }
  }

  submitLeadDetails() {
    let postParams1 = {
      "userId": localStorage.getItem('userId'),
      "userType": localStorage.getItem('userType'),
      "txnId": this.txnId,
      "requestFrom": "App",
      "token": ""
    };

    const loading = this.loadingCtrl.create({ content: 'Processing..' });
    loading.present();
    this.subscrProvider.submitPaymentDetails(postParams1).then((result) => {
      let alldet: any = result;
      if (alldet.response.status == 'Success') {
        let responseData: any = alldet.response.responseObject;
        if (responseData.Status == 'Success') {
          this.paymentDissplayMessage = responseData.displayMessageApp;
          loading.dismiss();
          this.presentPopover();
        }
      }
    });
  }

  presentPopover() {
    this.beforeSuccess = false;
    this.afterSuccess = true;
  }

}
