import { Component } from '@angular/core';
import { IonicPage, NavController,Platform,ModalController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
import moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-buyer-revise-quote',
  templateUrl: 'buyer-revise-quote.html',
})
export class BuyerReviseQuotePage {
  private regex: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
  rsponseSend: FormGroup;
  taxes: any = [];
  title: string;
  taxCount: number = 0;
  discountType; taxName = [];
  responseAttempt: boolean = false;
  resPoId; resType; rfqResponseId;
  responseobj;
  response: any = {};

  postParams: any = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "resType": "buyerRevise",
    "rfqProductLineIds": "",
    "token": ""
  };

  postRes: any = {
    "responseListObject": [],
    "responseObject": {
      "end_response_date": "",
      "user_id": localStorage.getItem('userId'),
      "userType": localStorage.getItem('userType'),
    }
  };

  minDate = moment.utc().startOf('day').format('YYYY-MM-DD');
  maxDate = moment.utc().startOf('day').format('2020-12-31');
  activeTax:any=[];
  tempTax:any=[];
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public viewCtrl: ViewController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public req: RequestProvider,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    public navParams: NavParams) {

      if (this.platform.is('android') || this.platform.is('ios')) {
         this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Buyer Revise Quote');
         })
       .catch(e => console.log('Error starting GoogleAnalytics', e));
       }
    this.postParams.resType = this.resType;
    this.resPoId = this.navParams.get('id');
    this.postParams.rfqProductLineIds = this.resPoId;
    this.loadResponse();
    this.rsponseSend = this.formBuilder.group({
      qty: ['', Validators.required],
      unit: ['', Validators.required],
      unitCost: ['', Validators.required],
      // taxApplied: '',
      taxes: this.formBuilder.array([]),
      totalTaxAmount: '',
      discount: '',
      discountType: '',
      totalAmount: '',
      creditDays: '',
      tandc: '',
      sampleAddress: '',
      endQuoteValidityDate: ['', Validators.required]
    });


  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  ionViewDidLoad() {
    this.addTax();
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    this.postRes.responseListObject.uniqueId = randLetter + Date.now();
    this.postRes.responseListObject.rfq_response_id = this.resPoId;
  }
  /* validations start */

  unitCostValidations(event) {
    let dot = false;
    let val = event.target.value;
    if (val.search(".")) {
      dot = true;
    }
    let lastValue = val.substring(val.length - 1);
    let newValue = "";
    if (lastValue == '.' && dot) {
      newValue = val.substring(0, -1);
    }
   
  }

  /* validations end  */

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  loadResponse() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.req.buyerReviseGetDetails(this.postParams).then((result) => {
        let all: any = result;
        if (all.response.status == 'success') {
          this.response = all.response.responseListObject[0];
          this.rfqResponseId = this.response.RFQResponseId;
          this.activeTax = this.response.activeTaxes;
          var qty = this.rsponseSend.get('qty');
          qty.setValue(this.response.quantity);
          var totalAmount = this.rsponseSend.get('totalAmount');
          totalAmount.setValue(this.response.amount);
          var unitCost = this.rsponseSend.get('unitCost');
          unitCost.setValue(this.response.unitCost);
          var discount = this.rsponseSend.get('discount');
          discount.setValue(this.response.discount);
          var discountType = this.rsponseSend.get('discountType');
          discountType.setValue(this.response.discountType);
          this.discountType = this.response.discountType;
          var creditDays = this.rsponseSend.get('creditDays');
          creditDays.setValue(this.response.creditDays);
          var tandc = this.rsponseSend.get('tandc');
          tandc.setValue(this.response.termsnCondition);
          const control = <FormArray>this.rsponseSend.controls['taxes'];
          this.response.taxes.forEach((item, index) => {
            if (index != 0) { this.addTax(); }
           
            control.controls[index].get('taxName').setValue(item.taxName);
            this.activeTax.forEach((element,index) => {
              if(element.id == item.taxName){
               element.applied = true;
              }
           });
           
            this.taxName[index] = item.taxName;
            control.controls[index].get('taxPersontage').setValue(item.taxPersontage);
            control.controls[index].get('taxAmount').setValue(item.taxAmount);
          });
          loading.dismiss();
        }else{
          this.presentAlert('Something Went Wrong, Please Try After Sometime.');
          loading.dismiss();
        }
        }, (err) => {
          console.log(err);
          loading.dismiss();
        });
    });
  }
 
  createItem() {
    return this.formBuilder.group({
      taxName: [''],
      taxPersontage: '',
      taxAmount: ''
    });
  }

  addTax(): void {
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.push(this.createItem());
    this.taxName.push('');
    this.taxCount++;
  }

  removeTax(value,index: number) {
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.removeAt(index);
    this.taxName.splice(index, 1);
    this.activeTax.forEach((element,index) => {
      if(element.id == value){
       element.applied = false;
      }
   });
    this.taxCount--;
    this.calculateTotal();
  }

  changeTaxName(item,value,i) {
    let previousValue = item.get('taxName').value;
    if(previousValue!=''){
     this.activeTax.forEach((element,index) => {
       if(element.id == previousValue){
        element.applied = false;
       }
    });
    }
    this.activeTax.forEach((element,index) => {
      if(element.id == value){
       element.applied = true;
      }
   });
   item.get('taxName').setValue(value);
   this.calculateTotal();
 }

  changeDiscountType(val) {
    var discountType = this.rsponseSend.get('discountType');
    discountType.setValue(val);
    this.discountType = val;
    this.calculateTotal();
  }
  setDiscountType() {
    var discount = this.rsponseSend.get('discount');
    var discountType = this.rsponseSend.get('discountType');
    if (discountType.value == '') {
      if (discount.value != '') {
        discountType.setValue('P');
        this.discountType = 'P';
        this.calculateTotal();
      }
    } else {
      this.calculateTotal();
    }
  }
  calculateTax(item) {

    if (item.get('taxName').value == '') {
      if (item.get('taxPersontage').value != '') {
        item.get('taxName').setValidators([Validators.required]);
        item.get('taxName').updateValueAndValidity();
      }
    }
    else {
      this.calculateTotal();
    }
  }
  calculateTotal() {

    var totAmt: number;
    var qty = this.rsponseSend.get('qty');
    var totalAmount = this.rsponseSend.get('totalAmount');
    var unitCost = this.rsponseSend.get('unitCost');
    //var taxApplied = this.rsponseSend.get('taxApplied');
    var discount = this.rsponseSend.get('discount');
    var discountType = this.rsponseSend.get('discountType');
    var totalTaxAmount = this.rsponseSend.get('totalTaxAmount');
    var totaltax = 0;
    let unitCo: number;
    if (unitCost.value == '') { unitCo = 0; } else { unitCo = unitCost.value; }
    var quotePrice: number = parseFloat(qty.value) * unitCo;

    totAmt = quotePrice;
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.controls.forEach(function (value) {
      if (value.get('taxName').value != '') {
        if (value.get('taxPersontage').value != '') {
          let taxP = value.get('taxPersontage').value;
          let taxA = (taxP / 100) * quotePrice;
          value.get('taxAmount').setValue(taxA.toFixed(2));
          totaltax = totaltax + taxA;
          totAmt = totAmt + taxA;
        }
      }
    });
    if (discount.value != '') {
      if (discountType.value == 'P') {
        if (discount.value > 100) {
          discount.setErrors({ 'maxPerc': true });
        }
        else {
          if (discount.hasError['maxPerc'] == false) {
            discount.setErrors({ 'maxPerc': null });
          }

          let dico = (discount.value / 100) * totAmt;
          totAmt = totAmt - dico;
        }
      } else {
        let newtotAmt = totAmt - parseFloat(discount.value)
        if (newtotAmt < 0) {
          discount.setErrors({ 'maxFlat': true });
          totAmt = newtotAmt;
        } else {
          if (discount.hasError['maxPerc'] == false) {
            discount.setErrors({ 'maxFlat': null });
          }
          totAmt = newtotAmt;
        }
      }
    }
    totalTaxAmount.setValue(totaltax.toFixed(2));
    totalAmount.setValue(totAmt.toFixed(2));
  }
  submitResponse() {
    this.responseAttempt = true;
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.controls.forEach(function (value) {
      if (value.get('taxName').value != '') {
        value.get('taxPersontage').setValidators([Validators.required])
      }
      value.get('taxPersontage').updateValueAndValidity();
    });

    if (!this.rsponseSend.valid) {
     
    }
    else {
      let control = <FormArray>this.rsponseSend.controls['taxes'];
      let appliedTaxes:any=[];
      control.controls.forEach((element) =>{
        if (element.get('taxName').value != '') {
          appliedTaxes.push(element.value)
         
        }
      });
      this.postRes.responseListObject.push({
        "rfqProductLineIds": this.resPoId,
        "rfq_response_id": this.rfqResponseId,
        "unit_of_quantity": this.rsponseSend.get('unit').value,
        "quantity": this.rsponseSend.get('qty').value,
        "quote_price": this.rsponseSend.get('unitCost').value,
        "Discount": this.rsponseSend.get('discount').value,
        "DiscountType": this.rsponseSend.get('discountType').value,
        "termsandcond": this.rsponseSend.get('tandc').value,
        "Lasting_Date": this.rsponseSend.get('endQuoteValidityDate').value,
        "creditDays": this.rsponseSend.get('creditDays').value,
        "Amount": this.rsponseSend.get('totalAmount').value,
        "Taxes_and_charges": appliedTaxes,
        "Total_Tax": this.rsponseSend.get('totalTaxAmount').value,
        "SampleVisitAddress": this.rsponseSend.get('sampleAddress').value,
        "requestFrom":"App"
      });

      this.postRes.responseObject.end_response_date = this.rsponseSend.get('endQuoteValidityDate').value;

      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.req.sendBuyerRevise(this.postRes).then((result) => {
          let buyerDetails:any = result;
          let buyerDetailsR = buyerDetails.response; 
           if(buyerDetailsR.status=='success'){
            let pushNotifications = buyerDetailsR.responseObject.pushNotifications;
            if (pushNotifications.length > 0) {
              let icntr;
              let today = new Date();
              for (icntr = 0; icntr < pushNotifications.length; icntr++) {
                // this.note.genUserAll = this.db.list('/usernotification/' + pushNotifications[icntr].Seller_Id);              
                // this.note.genUserAll.push({
                //   "message": pushNotifications[icntr].message,
                //   "isRead": "No",
                //   "postedDate": today.toLocaleString(),
                //   "notificationType": pushNotifications[icntr].notificationType,
                //   "status": pushNotifications[icntr].status,
                //   "id": pushNotifications[icntr].id,
                //   "userType": pushNotifications[icntr].userType,
                //   "icon": pushNotifications[icntr].Company_Logo,
                //   "redirectUrl": pushNotifications[icntr].redirectUrl,
                // });
              }
            }
            loading.dismiss();
            this.navCtrl.pop();
            //this.presentAlert('Revise Quote Sent Successfully.');
            
          }
          else {
            loading.dismiss();
            this.navCtrl.pop();
            this.presentAlert('Something Went Wrong, Please Try After Sometime.');
           
          }
        });
      });
    }
  }


}
