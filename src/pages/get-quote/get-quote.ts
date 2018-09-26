import { Component } from '@angular/core';
import { IonicPage, ModalController,ViewController,NavController,AlertController,ActionSheetController, Loading, ToastController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { GetSearchQuoteProvider } from '../../providers/get-search-quote/get-search-quote';
import { AuthProvider } from '../../providers/auth/auth';
import { CommonClass } from '../../providers/commonclass';
import { Validators,FormGroup, FormBuilder,FormArray,AbstractControl } from '@angular/forms';
//import { Toast } from '@ionic-native/toast';
import { Autosize } from '../../directives/autosize/autosize'
import moment from 'moment';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer'; import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { FileChooser } from '@ionic-native/file-chooser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { SearchProvider } from '../../providers/search/search';
import { PopoverController } from 'ionic-angular';
import { App } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification'
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';

import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
declare var cordova: any;

import { AppliedFilterPipe } from '../../pipes/applied-filter/applied-filter'
@IonicPage()
@Component({
  selector: 'page-get-quote',
  templateUrl: 'get-quote.html',
})
export class GetQuotePage {
  popover;
  lastImage: string = null;
  loading: Loading;
  cropedImage: string = null;
  corpth: string = null;
  cornme: string = null;
  data: any;
  datas: any;
  datas_msg: any;
  type: string = 'New'; imageId: string; currentfileName;
  imgDeleted: any;
  uploadedDocs: any = [];
  ionLeave:boolean=false;
  sellerproId;
  singleQuote:boolean=false;
  multiQuote:boolean=false;
  getQuoteData:any=[];

 getQuoteInput:any = {
   "endResponseDate":"",
   "location":"",
   "countryId":"",
   "stateId":"",
   "cityId":"",
   "locationId":"",
   "uniqueId":"",
   "quoteData":null,
   "userId": localStorage.getItem('userId'),
   "userType": localStorage.getItem('userType'),
   "requestFrom":"App"
 }
 getQuoteBe4:boolean=true;
 getQuoteafter:boolean=false;
  getQuoteForm: FormGroup;
  submitAttempted;
  GetQuoteBeforeAttempted:boolean=false;
  items:any = [];
  getQuoteRes:any;
  minDate = moment.utc().startOf('day').format('YYYY-MM-DD');
  maxDate = moment.utc().startOf('day').format('2020-12-31');
  mainUrl="";
  activePortal:boolean=false;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public popoverCtrl: PopoverController,
    public formBuilder: FormBuilder,
    public gQ:GetSearchQuoteProvider,
    public sP: SearchProvider,
    public com:CommonClass,
    public authProvider: AuthProvider,
    private ga: GoogleAnalytics,
    private crop: Crop,
    public app: App,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    private fileChooser: FileChooser,
    private camera: Camera,
    public alertCtrl:AlertController,
    public http: HttpClient,
    private transfer: FileTransfer,
    public platform: Platform,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
   // private toast: Toast,
    public viewCtrl: ViewController) {
      this.mainUrl = this.com.url;
       if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    //if(this.navParams.get('quoteType') =='single'){  
      // this.singleQuote = true;
     //  this.multiQuote=false;
     // }else{ 
       // this.singleQuote = false;
     //   this.multiQuote=true;
    //  }
     this.sellerproId =  this.navParams.get('sellerProId');
     this.getQuoteForm = this.formBuilder.group({
      location: ['', Validators.required],
      endResponseDate: ['', Validators.required],
      items: this.formBuilder.array([])
    });
    
   var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
   this.getQuoteInput.uniqueId = randLetter + Date.now();
    this.getQuoteDetails();
    if(this.sP.product_search.city_id!=0){
      this.getQuoteInput.location = this.sP.product_search.Location_Name;
      this.getQuoteInput.countryId = this.sP.product_search.country_id;
      this.getQuoteInput.stateId = this.sP.product_search.state_id;
      this.getQuoteInput.cityId = this.sP.product_search.city_id;
      this.getQuoteInput.locationId = this.sP.product_search.location_id;
      this.getQuoteForm.controls['location'].setValue(this.sP.product_search.Location_Name); 
    }
  }
  toHTML(input): any {
    return new DOMParser().parseFromString(input, "text/html").documentElement.textContent;
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      qty: ['',Validators.required,this.validQty.bind(this)],
      unit: ['',Validators.required],
      sellerProId:'',
      creaditDays: '',
      specification: '',
      fileUploads:'',
      address:''
    });
  }
  validQty(control: AbstractControl) {
    return observableOf('0' === control.value).pipe(
      map(result => result ? { invalid: true } : null)
    );
  }

  ionViewCanLeave(): Promise<boolean> {
   // let activePortal = this.app._appRoot._loadingPortal.getActive() || this.app._appRoot._modalPortal.getActive() || this.app._appRoot._overlayPortal.getActive();
       return new Promise((resolve: any, reject: any) => {
        if(this.ionLeave){
          resolve();
        }
        else if(this.activePortal)
        {
          this.popover.dismiss();
          this.activePortal =false;
          reject();
        }
        else{
            let alert = this.alertCtrl.create({
            // title: 'Apply Filter Changes',
            message: 'Do you want to cancel this quote?',
            });
            alert.addButton({
              text: 'No',
              role: 'cancel',
              handler: () => {
                reject();
              }
            
            });
            alert.addButton({
              text: 'Yes',
              handler: () => {      
              resolve();
              }
            });
            alert.present();
         
    }
  });
     
   
  }
 
  back(){
    this.getQuoteBe4=true;
    this.getQuoteafter=false;
  }
 
  submitGetQuoteAfter(){
    this.GetQuoteBeforeAttempted = true;
    if (!this.getQuoteForm.valid) {
      this.getQuoteBe4=false;
      this.getQuoteafter=true;
      //console.log('invalid');
    }
    else {
   
      this.getQuoteBe4=false;
      this.getQuoteafter=true;
      this.getQuoteInput.endResponseDate = this.getQuoteForm.controls['endResponseDate'].value;
      this.getQuoteInput.quoteData = this.getQuoteForm.value;
      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() =>{
       this.gQ.getQuoteSend(this.getQuoteInput).then((result) => {
        this.getQuoteRes = result;
        this.getQuoteRes = this.getQuoteRes.response;
       
          let pushNotifications = this.getQuoteRes.responseObject.pushNotifications;
          console.log(pushNotifications);
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
            loading.dismiss();
            this.ionLeave=true;
            let successSend = this.modalCtrl.create('GetQuoteSuccessPage',{data:this.getQuoteRes.responseObject.requestedQuotes});
            successSend.present({ keyboardClose: false });
            successSend.onDidDismiss((data) => {
              this.viewCtrl.dismiss(data);              
            });
          
        }   
        else if (this.getQuoteRes == 'fail') 
        {
           loading.dismiss();
           let Msg = "";
           this.presentAlert(Msg); 
         }
       }, (err) => {
            console.log(err);
      });
    });
      console.log(this.getQuoteInput);
    }
  }
 
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  
  addItem(): void {
    this.items = this.getQuoteForm.get('items') as FormArray;
    this.uploadedDocs.push([]);
    this.items.push(this.createItem());
  }
  requestSample(){
    this.getQuoteData.sampleRequested = !this.getQuoteData.sampleRequested;
  }

  location() {
    this.ionLeave=true;
    let locationModal = this.modalCtrl.create('LocationPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      if(data!=null){
        this.getQuoteInput.location = data.Location;
        this.getQuoteInput.countryId = data.Country_Id;
        this.getQuoteInput.stateId = data.State_Id;
        this.getQuoteInput.cityId = data.City_Id;
        this.getQuoteInput.locationId = data.Location_Id;
        this.getQuoteForm.controls['location'].setValue(data.Location); 
      }
    });
  }

  openUnit(units,i){
    this.ionLeave=true;
      let unitModal = this.modalCtrl.create('UnitPopupPage',{unit:units});
      unitModal.present({ keyboardClose: false });
      unitModal.onDidDismiss((data) => {
        if(data!=null){
        i.setValue(data.Unit_Title);
        }
      }); 
  }
  getQuoteDetails(){
    let postParams = {
      "sellerProductId": this.sellerproId,
      "Request_From": "App",
      "Token": ""
    };
    const loading = this.loadingCtrl.create({
      content: 'Please wait..',
    });
   
    loading.present().then(() => {
      this.gQ.getQuoteDetails(postParams).then((result) => {
        let res:any ={};
        res = result;
        console.log(res);
        this.getQuoteData = res.response.responseObject;
        loading.dismiss();
        for(let entry of this.getQuoteData)
        {
          this.addItem();
        }
       
      });
    });

  }


  cancelQuote()
  {
    let alert = this.alertCtrl.create({
     // title: 'Confirm purchase',
      message: 'Do you want to cancel this quote?',
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
            this.viewCtrl.dismiss(null);
          }
        }
      ]
    });
    alert.present();
     
  }

  sendQuote(data)
  {
    this.viewCtrl.dismiss(null);
  }

  public presentActionSheet(formField,i) {
   // console.log(formField);
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY,formField,i);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA,formField,i);
          }
        },
        {
          text: 'Upload Pdf, Docs, Excel',
          handler: () => {
            this.uploadDoc(formField,i);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }


  public takePicture(sourceType,formField,i) {
    // Create options for the Camera Dialog
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };
    // Get the data of an image
    this.camera.getPicture(options).then((imagePath) => {
      // Special handling for Android library
      this.crop.crop(imagePath)
        .then(newImage => {
          if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
            this.filePath.resolveNativePath(newImage)
              .then(filePath => {
                let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
                let currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
                this.corpth = correctPath;
                this.cornme = currentName;
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),formField,i);
              });
          } else {
            var currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
            var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
            this.corpth = correctPath;
            this.cornme = currentName;
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(),formField,i);
          }
        },
        error => { console.error('Error cropping image', error) }
        );
    }, (err) => {
      this.presentToast('Error while selecting image.');
    });
  }

  // Create a new name for the image
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }


  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName, newFileName,formField,i) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(this.type, this.imageId,formField,i);
    }, error => {
      //this.presentToast('Error while storing file.');
    });
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  // Always get the accurate path to your apps folder
  public pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(type, imageId,formField,i) {
    var url = this.mainUrl+"TempFileImgUpload/getQuoteImages";
    var targetPath = this.pathForImage(this.lastImage);
    var filename = this.lastImage;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { fileName: filename, userId: localStorage.getItem('userId'), updateStatus: type, imageId: imageId }
    };
    console.log(options);
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
    
    fileTransfer.upload(targetPath, url, options).then(data => {

      let datas = JSON.parse(data.response);
      console.log(this.uploadedDocs);
      this.uploadedDocs[i].push({
        "renamedFileName": datas.renamedFileName,
        "fileName": filename,
        "fileLink": datas.fileLink
      });
      if(formField.value==''){
        formField.setValue(datas.fileLink);
      }else{
        let names = formField.value;
        names += ','+ datas.fileLink;
        formField.setValue(names);
      }
      this.loading.dismissAll()
      this.presentToast('Image succesfully uploaded.');
      this.type = "New";
      this.imageId = '';
    }, err => {
      this.loading.dismissAll()
      this.presentToast(err.message + ' Error while uploading file.');
    });
  }

  

  deleteImage(link,i) {
    this.loading = this.loadingCtrl.create({
      content: 'Deleteing...',
    });
    this.loading.present();
    const url = this.mainUrl+"TempFileImgDelete/deleteFileImg";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = { fileLink: link };
    this.http.post(url, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
      this.loading.dismissAll();
      this.imgDeleted = data;
      // this.presentToast(this.imgDeleted.response.responseObject);
      this.uploadedDocs[i].forEach(function (item, index, object) {
        if (item.fileLink === link) {
          object.splice(index, 1);
        }
      });
    }, err => {
      this.loading.dismissAll();
      console.log(err);
    });
  }



  uploadDoc(formField,i) {
    var url = this.mainUrl+"TempFileImgUpload/fileUpload";
    this.fileChooser.open()
      .then(uri => {
        const fileTransfer: FileTransferObject = this.transfer.create();
        this.filePath.resolveNativePath(uri)
          .then((filePath) => {
            this.currentfileName = filePath.substring(filePath.lastIndexOf('/') + 1);
            let options1: FileUploadOptions = {
              fileKey: "file",
              mimeType: "multipart/form-data",
              fileName: this.currentfileName,
              chunkedMode: false
            }
            console.log(options1);
            this.loading = this.loadingCtrl.create({
              content: 'Uploading...',
            });
            this.loading.present();
            fileTransfer.upload(uri, url, options1)
              .then((data) => {
                // success
                let datas = JSON.parse(data.response);
               
                this.uploadedDocs[i].push({
                  "renamedFileName": datas.renamedFileName,
                  "fileName":  this.currentfileName,
                  "fileLink": datas.fileLink
                });
                console.log(datas);
                this.loading.dismiss();

              }, (err) => {
                // error
                this.loading.dismiss();
              });
          }, (err) => {
            console.log(err);
          })
      })
      .catch(e => console.log(e));
  }

  openSellerName(comanyNames,myEvent){
    this.popover = this.popoverCtrl.create('SellerListPage',{data:comanyNames});
    this.activePortal =true;
    this.popover.present({
      ev: myEvent
    });
    this.popover.onDidDismiss(() => {
      this.activePortal = false;
  });
  }
}
