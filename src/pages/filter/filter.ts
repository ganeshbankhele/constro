import { Component } from '@angular/core';
import { IonicPage, ModalController,Platform,LoadingController,AlertController,NavController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  counter = 0;
  filters;
  
  constructor(public navCtrl: NavController,
    public modalCtrl: ModalController,
    public sp: SearchProvider,
    public alertCtrl:AlertController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
      if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }

     
  }

  resetFilter() {
    this.sp.canleave = true;
    const loading = this.loadingCtrl.create({
      content: ''
    });
    loading.present();
    this.sp.product_search.filters = [];
    this.sp.selectedFilter= [];
    this.sp.Price = [];
    this.sp.Moq = [];
    this.sp.Other = [];
    this.sp.selectedFilterString = [];
    this.sp.filter().then((result) => {
      this.filters = result;
      this.sp.cloneFilter123 = result;
      this.sp.Price = this.filters.Price;
      this.sp.Moq = this.filters.Moq;
      this.sp.Other = this.filters.Other;
      this.sp.Other.forEach(element => {
        this.sp.selectedFilterString.push({ "filterName": element.Filter_Name, "note": "" })
      });
      this.sp.priceRangeLower = this.sp.Price.Filter_Min_Value;
      this.sp.priceRangeUpper = this.sp.Price.Filter_Max_Value;
      this.sp.moqRange = this.sp.Moq.Filter_Min_Value;
      loading.dismiss();
    }, (err) => {
      console.log(err);
      loading.dismiss();
    });
  }


ionViewCanLeave(): Promise<boolean> {
  console.log(this.sp.canleave);
  if (this.sp.canleave) {
    return new Promise((resolve: any, reject: any) => {
      let alert = this.alertCtrl.create({
        title: 'Apply Filter Changes',
        message: 'Would you like to apply the changes?'
      });
      alert.addButton({
        text: 'Exit',
        role: 'cancel',
        handler: () => {
          resolve();
        }
       
      });
      alert.addButton({
        text: 'Apply',
        handler: () => {
         
         this.applyFilter();
         resolve();
        }
      });
      alert.present();
    });
  }
}

exitPage() {
  this.sp.canleave = false;
  this.navCtrl.pop();
  this.navCtrl.setRoot('SearchPage');
}

  applyFilter() {
    this.sp.canleave = false;
    this.sp.selectedFilter.push({Filter_Name: "MOQ", Filter_Min_Value:this.sp.moqRange});  
    this.sp.selectedFilter.push({Filter_Name: "Price", Filter_Min_Value: this.sp.priceRangeLower, Filter_Max_Value: this.sp.priceRangeUpper});
    //console.log(this.sp.selectedFilter);
    if(this.sp.selectedFilter.length != 0){
      this.sp.product_search.filters = [];
      this.sp.product_search.filters = this.sp.selectedFilter;
    }
    this.navCtrl.setRoot('SearchPage');
    
  }

  openFilter(arr) {
    console.log(this.sp.cloneFilter123);
    let productModal = this.modalCtrl.create('OpenFilterPage', { filterdata: arr });
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
         this.calFilter();
    });
  }

  calFilter() {
    this.sp.product_search.filters = [];
    this.sp.selectedFilter= [];
    Array.prototype.forEach.call(this.sp.Price, child => {
      if (child.Applied == true) {
        this.sp.selectedFilter.push(child);
      }
    });

    Array.prototype.forEach.call(this.sp.Moq, child => {
      if (child.Applied == true) {
        this.sp.selectedFilter.push(child);
      }
    });

    Array.prototype.forEach.call(this.sp.Other, child => {
      let checked: any = [];
      let chekdLocation = [];
      Array.prototype.forEach.call(child.Filter_Value, child1 => {
        if (child1.applied == true) {
          if (child.Filter_Name == "CompanyLocation") {
            checked.push(child1);
            chekdLocation.push(child1.Location);
          } else {
            checked.push(child1.value);
          }
        }
      });
      if (checked.length > 0) {
        let setarra = { Filter_Name: child.Filter_Name, Filter_Value: checked };
        this.sp.selectedFilter.push(setarra);
      }
        this.sp.selectedFilterString.forEach(element => {
          if (element.filterName == child.Filter_Name) {
            if (child.Filter_Name == "CompanyLocation") {
              element.note = this.sp.selectedFilterStringCal(chekdLocation);
            } else {
              element.note = this.sp.selectedFilterStringCal(checked);
            }
          }
        });
     
    });
    // console.log(this.sp.selectedFilter);
    if(this.sp.selectedFilter.length > 0){ this.sp.canleave = true; }
  }
}
