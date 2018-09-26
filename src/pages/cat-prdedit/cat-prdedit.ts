import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController, NavParams } from 'ionic-angular';
import { ProductCatelogProvider } from '../../providers/product-catelog/product-catelog';
import { NotificationProvider } from '../../providers/notification/notification'
import { Validators,FormGroup, FormBuilder,FormArray,AbstractControl } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-cat-prdedit',
  templateUrl: 'cat-prdedit.html',
})
export class CatPrdeditPage {
  proBasic:boolean=true;
  proTechSpec:boolean=true;
  proImages:boolean=true;
  proGread:boolean=true;
  proBrand:boolean=true;
  proOther:boolean=true;
  productForm;
  locations:any=[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public note:NotificationProvider,
    public formBuilder: FormBuilder,
  public proServ:ProductCatelogProvider,
  public loadingCtrl: LoadingController,) {
    // let postParams = {  
    //   "User_Id": localStorage.getItem('userId'),
    //   "User_Type": localStorage.getItem('userType'),
    // "startLimit": 0,
    // "noOfRecords": 20,
    // "requestFrom": "App",
    // "token": ""};
    // const loading = this.loadingCtrl.create({
    //   content: 'Please wait...'
    // });
    // loading.present().then(() => {
    //   this.proServ.getProServices(postParams).then((result) => {
    //     console.log(result);
    //   }, (err) => {
    //     console.log(err);
    //   });
    // });
    this.productForm =  formBuilder.group({
      productName: [],
      // variantName:[],
      productCode:[],
      minOrderQty:[],
      minOrderQtyUnit:[],
      minPrice:[],
      maxPrice:[],
      prodDescription:[],
      brandName:[],
      locations: this.formBuilder.array([]),
      callAsProduct:[],
      reccUse:[],
      prodGread:[],
      innoDesc:[],
      latestLaunchDesc:[],
    });
    this.addItem();
  }
  addItem(): void {
    this.locations = this.productForm.get('locations') as FormArray;
    this.locations.push(this.createItem());
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
     location:[],
     countryId:[],
     cityId:[],
     stateId:[],
     locationId:[],
     pincode:[]
    });
  }

  ionViewDidLoad() {
    
  }

  openNotification(page){
    this.navCtrl.push(page);
 }
 
  proBasicCollapse(){
    this.proBasic= !this.proBasic;
  }
  proTechSpecCollapse(){
    this.proTechSpec= !this.proTechSpec;
  }
  proImagesCollapse(){
    this.proImages= !this.proImages;
  }
  proGreadCollapse(){
    this.proGread= !this.proGread;
  }
  proBrandCollapse(){
    this.proBrand= !this.proBrand;
  }
  proOtherCollapse(){
    this.proOther= !this.proOther;
  }
}
