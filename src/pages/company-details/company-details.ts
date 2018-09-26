import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { CommonProvider } from '../../providers/common/common';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { AuthProvider } from '../../providers/auth/auth';
import { GoogleAnalytics } from '@ionic-native/google-analytics';

@IonicPage()
@Component({
  selector: 'page-company-details',
  templateUrl: 'company-details.html',
})
export class CompanyDetailsPage {

  @ViewChild(Slides) slides: Slides;
  selectedCheck: any;
  responseobj;
  currentIndex = 0;
  responseobjRes: any = {};
  responseobjResObj: any = {};
  contactDetails: any = {};
  productSpecification: any = [];
  productDetails: any = {};
  productDeliveryLocation: any = [];
  responseobjSimmi: any = {};
  responseobjResSimmi: any = {};
  responseobjResObjSimmi: any = {};
  simmillarProducts: any = [];
  productVariants: any = [];
  postParams: any = {
    catId: "1",
    requestFrom: "App",
    sellerProductId: "6949",
    subCatId: "3",
    token: "",
    userId: localStorage.getItem('userId'),
    userType: localStorage.getItem('userType')
  }
  showFooter: boolean = false;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sP: SearchProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    private ga: GoogleAnalytics,
    public platform: Platform,
    public authProvider: AuthProvider,
    public loadingCtrl: LoadingController,
    public cm: CommonProvider
  ) {
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Company Details');
         })
         .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    let det = this.navParams.get('datas');
    this.postParams.sellerProductId = det.sellerProductId;
    this.postParams.catId = det.catId;
    this.postParams.subCatId = det.subCatId;
    // this.showFooter = det.isVariant;
    this.loadCompDetails();
  }

  loadCompDetails() {
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.cm.companyDetails(this.postParams).then((result) => {
        this.responseobj = result;
        this.responseobjRes = this.responseobj.response;
        this.responseobjResObj = this.responseobjRes.responseObject;
        this.productDetails = this.responseobjResObj.productDetails;
        this.productDeliveryLocation = this.responseobjResObj.productDeliveryLocation;
        this.productSpecification = this.responseobjResObj.productSpecification;
        this.contactDetails = this.responseobjResObj.contactDetails;
        this.productVariants = this.responseobjResObj.productVariants;
        if (this.productVariants.length != 0) {
          this.showFooter = true;
        }



        loading.dismiss();
        this.getSimilarSellers();
      });
    });
  }

  ngAfterViewInit() {
    this.slides.autoHeight = true;

  }

  directGetQuotes(sellProductId) {
    if (sellProductId != '') {
      if (this.authProvider.userId == '') {
        let login = this.modalCtrl.create('LoginSignUpPage');
        login.present({ keyboardClose: false });
        login.onDidDismiss((data) => {
          if (data != null) {
            this.directGetQuotes(sellProductId);
          }
        });
      }
      else {
        // if (!this.authProvider.checkEmailId) {
        //   let emptyProfile = this.modalCtrl.create('EmptyProfilePage');
        //   emptyProfile.present({ keyboardClose: false });
        //   emptyProfile.onDidDismiss((data) => {
        //     if (data != null) {
        //       this.directGetQuotes(sellProductId);
        //     }
        //   });

        // } 
        // else {
        let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: sellProductId, quoteType: 'single' });
        getQuoteModal.present({ keyboardClose: false });
        getQuoteModal.onDidDismiss((data) => {
        });
        //  }
      }
    } else {
      this.presentToast('Please Select At Least 1 Product To Get Quote.');
    }
  }

  getQuotes() {
    if (this.sP.getQuoteidsCompanyPage.length > 0) {
      let getQuoteModal = this.modalCtrl.create('GetQuotePage', { sellerProId: this.sP.getQuoteidsCompanyPage, quoteType: 'single' });
      getQuoteModal.present({ keyboardClose: false });
      getQuoteModal.onDidDismiss((data) => {
      });
    } else {
      this.presentToast('Please Select At Least 1 Product To Get Quote.');
    }
  }

  viewAllVariant(variantData) {

    let details = { varData: variantData };
    console.log(details);
    let variantModal = this.modalCtrl.create('CompanyVariantPage', { variant_data: details });
    variantModal.present();
    variantModal.onDidDismiss((data) => {
      variantData.forEach(element => {
        element.selected = false;
      });
    });


  }
  myShop(userid, compid) {
    let detail = { userId: userid, compId: compid }
    this.navCtrl.push('MyShopPage', { data: detail })
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  goToSlideSpeci() {
    this.slides.slideTo(0, 500);
  }
  goToSlideSell() {
    this.slides.slideTo(1, 500);
  }
  goToSlideProd() {
    this.slides.slideTo(2, 500);
  }
  getSimilarSellers() {
    let postParam = {
      genericProductId: "53",
      noOfRecords: 12,
      productUser_Id: "598",
      requestFrom: "App",
      startLimit: 0,
      token: "",
      userId: "1899"
    }
    this.cm.getSimilarSellers(postParam).then((result) => {
      this.responseobjSimmi = result;
      this.responseobjResSimmi = this.responseobjSimmi.response;
      this.responseobjResObjSimmi = this.responseobjResSimmi.responseObject;
      this.simmillarProducts = this.responseobjResObjSimmi.similarProductsList;
      console.log(this.simmillarProducts);

    });

  }

  slideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    console.log('Current index is', this.currentIndex);
  }
}
