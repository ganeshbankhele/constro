import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, ModalController, NavParams, ViewController } from 'ionic-angular';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { RequestProvider } from '../../providers/request/request';
import moment from 'moment';
import { GstValidator } from '../validators/gstValidator';
import { Autosize } from '../../directives/autosize/autosize'
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';


@IonicPage()
@Component({
  selector: 'page-purchase-order',
  templateUrl: 'purchase-order.html',
})

export class PurchaseOrderPage {
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
    "resType": "",
    "rfqProductLineIds": "",
    "requestFrom":"App",
    "token": ""
  };
  sellerId;
  userGSTNumber;
  sellerGSTNo;
  locationName;
  genericProductId;
  sellerProductId;
  postRes: any = {
    po_list: []
  };
  productArray: any = [];
  minDate = moment.utc().startOf('day').format('YYYY-MM-DD');
  maxDate = moment.utc().startOf('day').format('2020-12-31');
  activeTax:any=[];
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    public authProvider: AuthProvider,
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
    this.postParams.resType = "PO";
    this.resPoId = this.navParams.get('id');
    console.log(this.resPoId);
    //this.resPoId = "1834";
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
      userGSTNumber: ['', Validators.required],
      deliveryAddress: ['', Validators.required],
      endQuoteValidityDate: ['', Validators.required]
    }, {
        validator: GstValidator.MatchGST // your validation method
      });
  }

  ionViewDidLoad() {
    this.addTax();
    // var randLetter = String.fromCharCode(65 + Math.random() * 26));
    // this.postRes.responseListObject.uniqueId = randLetter + Date.now();
    // this.postRes.responseListObject.rfq_response_id = this.resPoId;
  }
  
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
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
      this.req.getOrderDetails(this.postParams).then((result) => {
        let all: any = result;
        if (all.response.status == 'Success') {
          loading.dismiss();
        this.response = all.response.responseObject[0];
        this.activeTax = this.response.activeTaxes;
        
        this.rfqResponseId = this.response.RFQResponseId;
        this.sellerId = this.response.sellerId; 
        this.userGSTNumber = this.response.userGSTNumber;
        this.sellerGSTNo  = this.response.sellerGSTNo;
        this.locationName = this.response.locationName;
        this.genericProductId = this.response.genericProductId;
        this.sellerProductId = this.response.sellerProductId;
        var qty = this.rsponseSend.get('qty');
        qty.setValue(this.response.quantity);

        var totalAmount = this.rsponseSend.get('totalAmount');
        totalAmount.setValue(this.response.amount);

        var unitCost = this.rsponseSend.get('unitCost');
        unitCost.setValue(this.response.unitCost);

        var discount = this.rsponseSend.get('discount');
        discount.setValue(this.response.discount);

        var gstCon = this.rsponseSend.get('userGSTNumber');
        gstCon.setValue(this.response.userGSTNumber);

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
          this.taxName[index] = item.taxName;
          control.controls[index].get('taxPersontage').setValue(item.taxPersontage);
          control.controls[index].get('taxAmount').setValue(item.taxAmount);
        });
       
        this.response.taxes.forEach((item, index) => {
          this.activeTax.forEach((element,index) => {
            if(element.id == item.taxName){
             element.applied = true;
            }
         });   
        }); 
        
        
      }else{
        loading.dismiss();
        this.presentAlert('Something Went Wrong, Please Try After Sometime.');
      }
      }, (err) => {
        loading.dismiss();
        console.log(err);
        
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
      console.log('invalid');
    }
    else {
      let control = <FormArray>this.rsponseSend.controls['taxes'];
      let appliedTaxes:any=[];
      control.controls.forEach((element) =>{
        if (element.get('taxName').value != '') {
          appliedTaxes.push(element.value)
        }
      });
        this.productArray = [{
        "Discount": this.rsponseSend.get('discount').value,
        "DiscountType": this.rsponseSend.get('discountType').value,
        "generic_product_id": this.genericProductId,
        "product_response_id": this.rfqResponseId,
        "quantity": this.rsponseSend.get('qty').value,
        "quote_price": this.rsponseSend.get('unitCost').value,
        "seller_product_id": this.sellerProductId,
        "taxes": appliedTaxes,
        "termsandcond": this.rsponseSend.get('tandc').value,
        "total_sub": this.rsponseSend.get('totalAmount').value,
        "total_taxex_amount_val": this.rsponseSend.get('totalTaxAmount').value,
        "unit_of_quantity": this.rsponseSend.get('unit').value
      }];
        
      this.postRes.po_list.push({
        "Buyer_GST_No": this.userGSTNumber,
        "Seller_GST_No": this.sellerGSTNo,
        "address": this.rsponseSend.get('deliveryAddress').value,
        "grand_total": this.rsponseSend.get('totalAmount').value,
        "location_name": this.locationName,
        "num_in_words": this.numtoword(this.rsponseSend.get('totalAmount').value),
        "po_valid_date_set": this.rsponseSend.get('endQuoteValidityDate').value,
        "product": this.productArray,
        "response_id":  this.rfqResponseId,
        "seller_id": this.sellerId,
        "termsandcond": "",
        "userId": localStorage.getItem('userId')
      });

      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.req.placePo(this.postRes).then((result) => {
          let orderDetails:any = result;
          let orderDetailsR = orderDetails.response; 
          if(orderDetailsR.status=='success'){

            let pushNotifications = orderDetailsR.responseListObject.pushNotifications;
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
           // this.navCtrl.setRoot('RequestPage');
           // this.presentAlert('Po Sent Successfully.');
            
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

   numtoword(junkVal)
	{
		var obStr = new String(junkVal);
    var numReversed = obStr.split(".");
    var dec = this.numToString(numReversed[0]) ;
    var frac = this.numToString(parseInt(numReversed[1])) ;
    if(frac != '')
		{
       return dec+' Rupees And '+frac +' Paisa Only';
		}
		if(frac == '')
		{
			return dec+' Rupees Only';
		}
	}
	
	numToString(x)
	{
   
    var r=0;
		var txter =x;
		var numStr="";
		if(isNaN(txter))
		{
			return false;
		}
		var n:number= parseInt(x);
		var places=0;
		var str="";
		var entry=0;
		while(n>=1)
		{
			r= Math.floor(n%10);
			if(places<3 && entry==0)
			{
        var srtdf1 = String(txter);
        numStr= srtdf1.substring(srtdf1.length-0,srtdf1.length-3) // Checks for 1 to 999.
        str= this.onlyDigit(numStr); //Calls function for last 3 digits of the value.
       	entry=1;
			}
			
			if(places==3)
			{ var srtdf2 = String(txter);
				numStr=srtdf2.substring(srtdf2.length-5,srtdf2.length-3) 
				//alert(numStr);
				if(numStr!="" && numStr!="00")
				{
          str= this.onlyDigit(numStr)+ "Thousand "+str;
				}
			}
			
			if(places==5)
			{
        var srtdf3 = String(txter);
				numStr=srtdf3.substring(srtdf3.length-7,srtdf3.length-5) //Substring for 5 place to 7 place of the string
				if(numStr!="" && numStr!="00")
				{
         	str= this.onlyDigit(numStr)+ " Lakhs "+str; //Appends the word lakhs to it
				}
			}
			
			if(places==6)
			{

        var srtdf4 = String(txter);
				numStr=srtdf4.substring(srtdf4.length-9,srtdf4.length-7)  //Substring for 7 place to 8 place of the string
				if(numStr!="" && numStr!="00")
				{
          str=this.onlyDigit(numStr)+ " Crores "+str;        //Appends the word Crores
				}
			}
			
			n= n/10;
			places++;
		}
		return str;
	}
	
	onlyDigit(n)
	{
    //debugger;
    console.log(n);
   //Arrays to store the string equivalent of the number to convert in words
		var units=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine'];
		var randomer=['','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
		var tens=['','Ten','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
		var r=0;
		var num = n;
		var str="";
		var pl=0;
		var tenser=0;
		while(num>=1)
		{
      r= num % 10;
      let temp = String(r)+String(tenser);
      tenser= parseInt(temp);
    	if(tenser <= 19 && tenser > 10) //Logic for 10 to 19 numbers
			{
        str=randomer[tenser-10];
			}
			else
			{
				if(pl==0)        //If units place then call units array.
				{
          
					str=units[Math.floor(r)];
				}
				else if(pl==1)    //If tens place then call tens array.
				{
          
					str=tens[Math.floor(r)]+" "+str;
				}
			}
			if(pl==2)        //If hundreds place then call units array.
			{
        
				str=units[Math.floor(r)]+" Hundred "+str;
			}
			
			num= num/10;
			pl++;
    }
		return str;
	}
}
