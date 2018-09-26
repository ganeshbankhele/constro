import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, ModalController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-variant-model',
  templateUrl: 'variant-model.html',
})
export class VariantModelPage {
  data: any;
  countSelected;
  checkEmailId;
  constructor(public navCtrl: NavController,
    public sP: SearchProvider,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public authProvider: AuthProvider,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
       if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    const variant_data = this.navParams.get('variant_data');
    this.countSelected = parseInt(variant_data.count);
    this.data = variant_data.varData;

  }
   
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  openCompanyPage(catId, subCatId, sellerProductId,isVariant) {
    let det = { "catId": catId, "subCatId": subCatId, "sellerProductId": sellerProductId,isVar:isVariant }
    this.navCtrl.push('CompanyDetailsPage', { datas: det });
  }
  addToGetquote(data) {
    var index = this.sP.getQuoteids.indexOf(data.seller_product_id);
    data.selected = !data.selected;
    if (index > -1) {
      this.countSelected -= 1;
      this.sP.getQuoteids.splice(index, 1);
    } else {
      this.countSelected += 1;
      this.sP.getQuoteids.push(data.seller_product_id);
    }
    console.log(this.sP.getQuoteids);
  }

  getQuotes() {
    if (this.sP.getQuoteids.length > 0) {
      if (this.authProvider.userId == '') {
        this.authProvider.loginAs = "Buyer";
        let login = this.modalCtrl.create('LoginSignUpPage');
        login.present({ keyboardClose: false });
        login.onDidDismiss((data) => {
          if (data != null) {
            this.getQuotes();
          }
        });
      } else {
        // if (!this.authProvider.checkEmailId) {
        //   let emptyProfile = this.modalCtrl.create('EmptyProfilePage');
        //   emptyProfile.present({ keyboardClose: false });
        //   emptyProfile.onDidDismiss((data) => {
        //     if (data != null) {
        //     this.getQuotes();
        //   }
        // });

        // } else {
        let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: this.sP.getQuoteids, quoteType: 'single' });
        getQuoteModal.present({ keyboardClose: false });
        getQuoteModal.onDidDismiss((data) => {
          if (data == 'request') {
            this.viewCtrl.dismiss('request');

          }
        });
        //  }
      }
    } else {
      this.presentToast('Please Select At Least 1 Product To Get Quote.');
    }


  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.countSelected);
  }

}

