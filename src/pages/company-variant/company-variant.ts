import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, ModalController, AlertController, ToastController, NavParams, ViewController } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';


@IonicPage()
@Component({
  selector: 'page-company-variant',
  templateUrl: 'company-variant.html',
})
export class CompanyVariantPage {
  data: any;
  constructor(public navCtrl: NavController,
    public sP: SearchProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public authProvider: AuthProvider,
    public navParams: NavParams,
    public viewCtrl: ViewController) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Company Variant');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    const variant_data = this.navParams.get('variant_data');
    this.data = variant_data.varData;
    console.log(this.data);
  }


  addToGetquote(data) {
    console.log(data);
    var index = this.sP.getQuoteidsCompanyPage.indexOf(data.seller_product_id);
    data.selected = !data.selected;
    if (index > -1) {

      this.sP.getQuoteidsCompanyPage.splice(index, 1);
    } else {

      this.sP.getQuoteidsCompanyPage.push(data.seller_product_id);
    }
    console.log(this.sP.getQuoteidsCompanyPage);
  }

  getQuotes() {
    if (this.sP.getQuoteidsCompanyPage.length > 0) {

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
        //       this.getQuotes();
        //     }
        //   });

        // } else {
        let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: this.sP.getQuoteidsCompanyPage, quoteType: 'single' });
        getQuoteModal.present({ keyboardClose: false });
        getQuoteModal.onDidDismiss((data) => {
        });
      }
      //  }
    }
    else {
      this.presentToast('Please Select At Least 1 Product To Get Quote.');
    }


  }
  openCompanyPage(catId, subCatId, sellerProductId, isVariant) {
    let det = { "catId": catId, "subCatId": subCatId, "sellerProductId": sellerProductId, isVar: isVariant }
    this.navCtrl.push('CompanyDetailsPage', { datas: det });
  }

  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
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
    if (this.sP.getQuoteidsCompanyPage.length > 0) {
      let alert = this.alertCtrl.create({
        title: 'Warning',
        message: 'Selection will be removed',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              // console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.sP.getQuoteidsCompanyPage = [];
              this.viewCtrl.dismiss(null);
            }
          }
        ]
      });
      alert.present();

    } else {
      this.viewCtrl.dismiss(null);
    }
  }
}

