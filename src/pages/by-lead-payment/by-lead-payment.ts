import { Component } from '@angular/core';
import { IonicPage, NavController,Platform,AlertController,ModalController, NavParams, LoadingController } from 'ionic-angular';
import { BuyLeadProvider } from '../../providers/buy-lead/buy-lead';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { AuthProvider } from '../../providers/auth/auth';
import { Validators, FormBuilder } from '@angular/forms';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserEvent } from '@ionic-native/in-app-browser';
import { GstValidator } from '../validators/gstValidator';
import { PopoverController } from 'ionic-angular';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-by-lead-payment',
  templateUrl: 'by-lead-payment.html',
})
export class ByLeadPaymentPage {
  data;userDetails;
  all;
  beforeSuccess:boolean =true;
  afterSuccess:boolean =false;
  responseData;
  PaymentForm;
  paymentSubmit:boolean=false;
  userStateStatus='';
  paymentString;
  surl:string;
  furl:string;
  stateError:boolean=true;
  isMaharashtra = false;
  GST: any = 0;
  iGST: any = 0;
  cGST: any = 0;
  sGST: any = 0;txnId=0;
  totalPackageAmount: any = 0;
  paymentDissplayMessage;
  userFullNamef:boolean=false;
  companyFullNamef:boolean=false;
  postParams:any={
    requestFrom:"App",
    token:"",
    userId:localStorage.getItem('userId'),
    userType:localStorage.getItem('userType')
  }
  constructor(public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public bl:BuyLeadProvider,
    public popoverCtrl: PopoverController,
    public formBuilder: FormBuilder,    
    public modalCtrl:ModalController,
    public viewCtrl:ViewController,
    private alertCtrl: AlertController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    private iab: InAppBrowser,
    public authProvider: AuthProvider,
    public navParams: NavParams) 
  {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
       .then(() => {
         this.ga.trackView('Buy Lead Payment');
       })
       .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.data = this.navParams.get('datas');
    this.purchaseLeads();
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
  }
  openTerms(){
    this.navCtrl.push('TermsPaymentPage');
  }
  purchaseLeads() {
    const loading = this.loadingCtrl.create({ content:'Please wait..'});
    loading.present();
    this.bl.getUserDetailsForPayment(this.postParams).then((result) => {
      this.userDetails = result;
      let details =  this.userDetails.userProfileReadiness
       this.GST = parseFloat(this.data.Buy_Amount) * 0.18;
       this.iGST = parseFloat(this.data.Buy_Amount) * 0.18;
       this.cGST = parseFloat(this.data.Buy_Amount) * 0.09;
       this.sGST = parseFloat(this.data.Buy_Amount) * 0.09;
     this.totalPackageAmount = parseFloat(this.data.Buy_Amount) + parseFloat(this.iGST);
    //   this.userDetailsAvailable = this.responseData.userProfileReadiness.userDetailsAvailable;
    //   this.companyFullName = this.responseData.userProfileReadiness.companyFullName;
       if(details.companyFullName!=''){this.companyFullNamef = true;}
      // this.userFullName = this.responseData.userProfileReadiness.userFullName;
       if(details.userFullName!=''){this.userFullNamef = true;}
    //   this.userCompanyAvailable = this.responseData.userProfileReadiness.userCompanyAvailable;
    //   this.userGSTNo= this.responseData.userProfileReadiness.userGSTNo;
    //   this.stateCode= this.responseData.userProfileReadiness.stateCode;
       if(details.stateCode!='' && details.stateCode!='27')
       {
         this.isMaharashtra=false;
       }
       this.PaymentForm.get('userFullName').setValue(details.userFullName);
       this.PaymentForm.get('userCompanyName').setValue(details.companyFullName);
       this.PaymentForm.get('userGSTNumber').setValue(details.userGSTNo);
       this.PaymentForm.get('userStateNo').setValue(details.stateCode);
      this.options.filter((item) => {
       if(item.stateId == details.stateCode){
         this.PaymentForm.get('userState').setValue(item.stateName);
         this.userStateStatus = item.stateName;
      }});
      if (details.stateCode != '27') {
        this.isMaharashtra = false;
      }else {
        this.isMaharashtra = true;
      }
     
      loading.dismiss();
    }, (err) => {
     
      loading.dismiss();
    });
  }
  dismiss()
  {
     this.viewCtrl.dismiss(null);
  }

  pay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      hardwareback: 'no',
      zoom: 'no'
    }
    const browser = this.iab.create(this.paymentString, "_self",options);
    browser.on('loadstart').subscribe((event: InAppBrowserEvent) => {
      if (event.url === this.surl) {
        browser.close();
        //this.paymentSuccess();
        this.submitLeadDetails();
      } else if (event.url === this.furl) {
        browser.close();
        this.submitLeadDetails();
       // this.paymentFailure();
      }
    });
  }

  
  submitLeadDetails(){
   let postParams1 = {
      "userId": localStorage.getItem('userId'),
      "userType": localStorage.getItem('userType'),
      "txnId": this.txnId,
      "requestFrom": "App",
      "token": ""
    };

    const loading = this.loadingCtrl.create({ content:'Processing..'});
    loading.present();
    this.bl.submitLeadPaymentDetails(postParams1).then((result) => {
      let alldet:any = result;
      if (alldet.response.status == 'Success')
       {
        let responseData:any = alldet.response.responseObject;
        if (responseData.Status == 'Success') {
          this.paymentDissplayMessage = responseData.displayMessage;
          loading.dismiss();
          this.presentPopover();
        }
      }
    });
  }
 
  presentPopover(){
    this.beforeSuccess = false;
    this.afterSuccess =true;
  }

  goBack(){
   // this.bl.tabSet(0);
  //  this.bl.tabChange == 'Yes';
    this.viewCtrl.dismiss(0);
   }
  goPusrchaseLeads(){
   // this.bl.tabSet(1);
   // this.bl.tabChange == 'Yes';
    this.viewCtrl.dismiss(1);
  }

  stateSelect() {
    let locationModal = this.modalCtrl.create('StateCodePage',{data : this.options});
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      if(data != null){
      this.PaymentForm.get('userState').setValue(data.stateName);
      this.userStateStatus = data.stateName;
      this.PaymentForm.get('userStateNo').setValue(data.stateId);
      if(data.stateId!='' && data.stateId!='27')
      {
        this.isMaharashtra=false;
      }else{
        this.isMaharashtra=true;
      }

      }
    });
  }
  
  gstValidator(){
    //let userStateNo = this.PaymentForm.controls['userStateNo'].value;
    let userState = this.PaymentForm.controls['userGSTNumber'].value;
    if(userState==''){
      this.PaymentForm.get('userState').setValue('');
      this.userStateStatus = "";
    }
    let getfirsttwochar = userState.substring(0, 2);
    if (getfirsttwochar != '27') {
      this.isMaharashtra = false;
    }else {
      this.isMaharashtra = true;
    }
    
    this.options.filter((item) => {
      if(item.stateId == getfirsttwochar){
        this.PaymentForm.get('userState').setValue(item.stateName);
        this.userStateStatus = item.stateName;
     }});
   
    // if(userStateNo!=getfirsttwochar){
    //   this.PaymentForm.get('userGSTNumber').setErrors( {MatchGST: true});
    //   this.stateError = true;
    // }else{
     
    //   this.stateError = false;
    // }
  }
  stateChanged(val){
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
   if (!this.PaymentForm.valid) {

   
   }
    else {     
     
      let userCompany = this.PaymentForm.controls['userCompanyName'].value;
      let userName = this.PaymentForm.controls['userFullName'].value;
      let userState = this.PaymentForm.controls['userStateNo'].value;
      let userGSTNumber = this.PaymentForm.controls['userGSTNumber'].value;
           if (this.authProvider.userId != '' && this.authProvider.userId != null) {
           let parameters = {
            "userId": localStorage.getItem('userId'),
            "userType": localStorage.getItem('userType'),
            "stateId": userState,
            "userGST": userGSTNumber,
            "userCompany": userCompany,
            "userName": userName,       
            "leadId": this.data.Lead_Id,
            "leadType": this.data.LeadType,    
            "requestFrom": "App",
            "isreferralincluded" :"No",
            "token": ""
           
          };
          
           this.bl.getUserPayment(parameters).then(data => {
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
                      <input type="hidden" name="udf2"  value="${this.responseData.formData.udf2}"size="64" />
                      <button type="submit" value="submit" #submitBtn></button>
                    </form>
                    <script type="text/javascript">document.getElementById("payu_form").submit();</script>
                  </body>
                </html>`;
                this.paymentString = 'data:text/html;base64,' + btoa(this.paymentString);
                this.pay();
              //  this.submitLeadDetails();
              //             alert('pay');
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
}

