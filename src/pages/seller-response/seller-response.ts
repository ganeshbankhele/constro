import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import { Autosize } from '../../directives/autosize/autosize';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
// import { of as observableOf } from 'rxjs/observable/of';
// import { map } from 'rxjs/operators/map';
import moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-seller-response',
  templateUrl: 'seller-response.html',
})
export class SellerResponsePage {
  rsponseSend: FormGroup;
  taxes: any = [];
  title: string;
  taxCount: number = 0;
  discountType; taxName = [];
  responseAttempt: boolean = false;
  resPoId; resType;
  responseobj;

  response: any = {};
  postParams: any = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "resType": "",
    "resPoId": "",
    "token": ""
  };

  postRes: any = {
    "userId": localStorage.getItem('userId'),
    "userType": localStorage.getItem('userType'),
    "uniqueId": "",
    "quantity": "",
    "unit": "",
    "unitCost": "",
    "discountPrice": "",
    "discountIs": "",
    "totalAmount": "",
    "termsCondition": "",
    "responseDate": "",
    "creditDays": "",
    "isfinalquote": "",
    "rfqId": "",
    "quoteType": "",
    "responseId": "",
    "totalTaxAmount": "",
    "taxData": "",
    "rfqLineId": "",
    "buyerId": "",
    "GenericProductIdValue": "",
    "SellerProductIdvalue": "",
    "companyIdRfq": "",
    "quantityRfq": "",
    "actualQuantityUnit": "",
    "requestFrom": "App",
    "token": ""
  };

  minDate = moment.utc().startOf('day').format('YYYY-MM-DD');
  maxDate = moment.utc().startOf('day').format('2020-12-31');
  activeTax: any = [];
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    public viewCtrl: ViewController,
    public req: RequestProvider,
    public navParams: NavParams) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.resType = this.navParams.get('type');

    if (this.resType == "revise") {
      this.title = "Revise"
    } else {
      this.title = "Response"
    }

    this.postParams.resType = this.resType;
    this.resPoId = this.navParams.get('id');
    this.postParams.resPoId = this.resPoId;
    this.loadResponse();


    this.rsponseSend = this.formBuilder.group({
      qty: ['', Validators.required],
      unitCost: ['', Validators.required],
      // taxApplied: '',
      taxes: this.formBuilder.array([]),
      discount: '',
      discountType: '',
      totalAmount: '',
      creditDays: '',
      tandc: '',
      isFinal: 'false',
      endQuoteValidityDate: ['', Validators.required]
    });

  }

  ionViewDidLoad() {
    this.addTax();
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    this.postRes.uniqueId = randLetter + Date.now();
    // this.postRes.rfqId = this.resPoId;
    this.postRes.quoteType = this.resType;
    this.postRes.responseId = this.resPoId;
  }

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
      this.req.loadSellerResponseQuote(this.postParams).then((result) => {
        let all: any = result;
        if (all.response.status == 'Success') {
          this.responseobj = all.response.responseObject;
          this.response = this.responseobj.requestResults;
          this.activeTax = this.response.activeTaxes;
          // output
          
          this.postRes.rfqId = this.response.rfqId;
          this.postRes.unit = this.response.unit;
          this.postRes.rfqLineId = this.response.rfqLineId;
          this.postRes.actualQuantityUnit = this.response.unit;
          this.postRes.buyerId = this.response.buyerId;
          this.postRes.GenericProductIdValue = this.response.GenericProductIdValue;
          this.postRes.SellerProductIdvalue = this.response.SellerProductIdvalue;
          this.postRes.companyIdRfq = this.response.companyIdRfq;

          // 
          var qty = this.rsponseSend.get('qty');
          qty.setValue(this.response.qty);

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
          tandc.setValue(this.response.termsAndCondition);

          const control = <FormArray>this.rsponseSend.controls['taxes'];
          this.response.taxArray.forEach((item, index) => {
            if (index != 0) { this.addTax(); }
            control.controls[index].get('taxName').setValue(item.taxName);
            control.controls[index].get('taxPercentage').setValue(item.taxPercentage);
            control.controls[index].get('taxAmount').setValue(item.taxAmmount);
            this.taxName[index] = item.taxName;

          });

          this.response.taxArray.forEach((item, index) => {
            this.activeTax.forEach((element, index) => {
              if (element.id == item.taxName) {
                element.applied = true;
              }
            });
          });
          loading.dismiss();
        } else {
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
      taxPercentage: '',
      taxAmount: ''
    });
  }

  addTax(): void {
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.push(this.createItem());
    this.taxName.push('');
    this.taxCount++;

  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }

  removeTax(value, index: number) {
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.removeAt(index);
    this.taxName.splice(index, 1);
    this.activeTax.forEach((element, index) => {
      if (element.id == value) {
        element.applied = false;
      }
    });
    this.taxCount--;
    this.calculateTotal();
  }

  changeTaxName(item, value, i) {
    let previousValue = item.get('taxName').value;
    if (previousValue != '') {
      this.activeTax.forEach((element, index) => {
        if (element.id == previousValue) {
          element.applied = false;
        }
      });
    }
    this.activeTax.forEach((element, index) => {
      if (element.id == value) {
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
      if (item.get('taxPercentage').value != '') {
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
    let unitCo: number;
    if (unitCost.value == '') { unitCo = 0; } else { unitCo = unitCost.value; }
    var quotePrice: number = parseFloat(qty.value) * unitCo;

    totAmt = quotePrice;

    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.controls.forEach(function (value) {
      if (value.get('taxName').value != '') {
        if (value.get('taxPercentage').value != '') {
          let taxP = value.get('taxPercentage').value;
          let taxA = (taxP / 100) * quotePrice;
          value.get('taxAmount').setValue(taxA.toFixed(2));
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
    totalAmount.setValue(totAmt.toFixed(2));
  }

  submitResponse() {
    this.responseAttempt = true;
    const control = <FormArray>this.rsponseSend.controls['taxes'];
    control.controls.forEach(function (value) {
      if (value.get('taxName').value != '') {
        value.get('taxPercentage').setValidators([Validators.required])
      }
      value.get('taxPercentage').updateValueAndValidity();
    });

    if (!this.rsponseSend.valid) {

    }
    else {

      // this.postRes.resArray = this.rsponseSend.getRawValue();
      this.postRes.quantityRfq = this.rsponseSend.get('qty').value;
      this.postRes.quantity = this.rsponseSend.get('qty').value;
      this.postRes.unitCost = this.rsponseSend.get('unitCost').value;
      this.postRes.discountPrice = this.rsponseSend.get('discount').value;
      this.postRes.discountIs = this.rsponseSend.get('discountType').value;
      this.postRes.totalAmount = this.rsponseSend.get('totalAmount').value;
      this.postRes.termsCondition = this.rsponseSend.get('tandc').value;
      this.postRes.responseDate = this.rsponseSend.get('endQuoteValidityDate').value;
      this.postRes.creditDays = this.rsponseSend.get('creditDays').value;
      this.postRes.isfinalquote = this.rsponseSend.get('isFinal').value;
      this.postRes.totalTaxAmount = this.rsponseSend.get('totalAmount').value;
      //this.postRes.taxData = this.rsponseSend.get('taxes');

      let control = <FormArray>this.rsponseSend.controls['taxes'];
      let appliedTaxes: any = [];
      control.controls.forEach((element) => {
        if (element.get('taxName').value != '') {
          appliedTaxes.push(element.value)

        }
      });

      this.postRes.taxData = appliedTaxes;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.req.setResponseAndRevise(this.postRes).then((result) => {
          let all: any = result;
          if (all.response.status == 'Success') {
            let pushNotifications = all.response.responseObject.pushNotifications
          if (pushNotifications.length > 0) {
            let icntr;
            let today = new Date();
            for (icntr = 0; icntr < pushNotifications.length; icntr++) {
              // this.note.genUserAll = this.db.list('/usernotification/' + pushNotifications[icntr].Buyer_Id);              
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
          } else {
            loading.dismiss();
            this.navCtrl.pop();
            this.presentAlert('Something Went Wrong, Please Try After Sometime.');

          }
        });
      });
    }
  }
}