import { Component } from '@angular/core';
import { IonicPage, ModalController, NavController, AlertController, ActionSheetController, Loading, ToastController, Platform, LoadingController, NavParams } from 'ionic-angular';
import { SearchProvider } from '../../providers/search/search';
import { Validators, FormBuilder } from '@angular/forms';
import { File } from '@ionic-native/file';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { CommonClass } from '../../providers/commonclass';
import { FileChooser } from '@ionic-native/file-chooser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PostRequirementProvider } from '../../providers/post-requirement/post-requirement';
import { EmailValidator } from '../validators/emailValidator';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { NotificationProvider } from '../../providers/notification/notification'
import { AuthProvider } from '../../providers/auth/auth';
// import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';

import { of as observableOf } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';
declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-posturrequirement',
  templateUrl: 'posturrequirement.html',

})
export class PosturrequirementPage {
  postRequirementFormBefore;
  postRequirementFormAfter;
  postBefore: boolean = true;
  postAfter: boolean = false;
  submitAttemptBefore = false;
  submitAttemptAfter = false;
  lastImage: string = null;
  loading: Loading;
  cropedImage: string = null;
  corpth: string = null;
  cornme: string = null;
  data: any;
  datas: any;
  datas_msg: any;
  
  type: string = 'New'; imageId: string; currentfileName;


  product_text: string = null;
  location: string = null;

  selectedLocation = {
    locationName: "",
    countryId: "",
    stateId: "",
    cityId: "",
    locationId: "",
    pinCode: ""
  };

  selectedProduct = {
    "productName": "",
    "genericProductId": 0,
    "variantName": ""
  }

  userName: string = "";
  mobileNo: string = "";
  emailId: string = "";
  nameExist:boolean=false;
  mobileExist:boolean=false;
  emailExist:boolean=false;
  uploadedDocs: any = [];
  imgDeleted: any;
 
  mainUrl="";
  
  constructor(public navCtrl: NavController,
    public sP: SearchProvider,
    public formBuilder: FormBuilder,
    private crop: Crop,
    public authProvider: AuthProvider,
    private ga: GoogleAnalytics,
    private fileChooser: FileChooser,
    private camera: Camera,
    public alertCtrl: AlertController,
    public http: HttpClient,
    private transfer: FileTransfer,
    public platform: Platform,
    private file: File,
    public com:CommonClass,
    // public db: AngularFireDatabase,
    public note:NotificationProvider,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public PR: PostRequirementProvider,
    public navParams: NavParams) {
      this.mainUrl = this.com.url;
     if (this.platform.is('android') || this.platform.is('ios')) {
       this.ga.startTrackerWithId('UA-91262155-1')
         .then(() => {
           this.ga.trackView('Enquiry Buyer');
         })
        .catch(e => console.log('Error starting GoogleAnalytics', e));
     }
    this.uploadedDocs = [];

    this.postRequirementFormBefore = formBuilder.group({
      productName: ['', Validators.required],
      orderQuantity: ['', Validators.required],
      unit: ['', Validators.required],
      deliveryLocation: ['', Validators.compose([Validators.required])],
      requirement: [''],
    });

    this.postRequirementFormAfter = formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.compose([EmailValidator.isValid])],
    });
    
    
    if(localStorage.getItem('firstLastName')!==null){
      
      this.userName = localStorage.getItem('firstLastName');
    }
    
    if(localStorage.getItem('phoneNo')!==null){
     
      this.mobileNo = localStorage.getItem('phoneNo');
    }

    if(localStorage.getItem('emailId')!==null){
     
      this.emailId = localStorage.getItem('emailId');
    }
    
    
   
    //console.log(this.emailId);
    if (this.userName != "") {
      this.nameExist=true;
      this.postRequirementFormAfter.controls['name'].setValue(this.userName);
    }

    if (this.emailId != "") {
      
      this.emailExist=true;
      this.postRequirementFormAfter.controls['email'].setValue(this.emailId);
    }

    if (this.mobileNo != "") {
      this.mobileExist=true;
      this.postRequirementFormAfter.controls['mobile'].setValue(this.mobileNo);
    }

  }
  openNotification(page){
    this.navCtrl.push(page);
 }
  locationSearch() {
    let locationModal = this.modalCtrl.create('PostYourReqLocationPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((data) => {
      if (data != null) {
        this.selectedLocation.countryId = data.Country_Id;
        this.selectedLocation.stateId = data.State_Id;
        this.selectedLocation.cityId = data.City_Id;
        this.selectedLocation.locationId = data.Location_Id;
        this.selectedLocation.locationName = data.Location;
        this.postRequirementFormBefore.controls['deliveryLocation'].setValue(data.Location);
        // console.log(this.postRequirementFormBefore);
      }
    });
  }

  productSearch() {
    let productModal = this.modalCtrl.create('PostRequirementProductPage');
    productModal.present({ keyboardClose: false });
    productModal.onDidDismiss((data) => {
      if (data != 'not selected') {
        // this.postRequirementForm.controls['productName'].markAsTouch();      
        this.postRequirementFormBefore.controls['productName'].setValue(data.productName);
        this.selectedProduct.productName = data.productName,
          this.selectedProduct.genericProductId = data.Product_Id,
          this.selectedProduct.variantName = data.variantName
      }
      console.log(this.selectedProduct);
      //  this.postRequirementFormBefore.controls['productName'].markAsTouched(true);
      // }
    });
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      subTitle: msg,
      buttons: ['Dismiss']
    });
    alert.present();
  }

  postRequirement() {
    this.submitAttemptBefore = true;
    if (!this.postRequirementFormBefore.valid) {

    } else {
     
      if (this.userName == '' || this.mobileNo == '' || this.emailId == '') {
        this.postBefore = false;
        this.postAfter = true;
      } else 
      {
        this.postReq();
      }


    }
  }

  postRequirementAfter() {
    this.submitAttemptAfter = true;
    let email = this.postRequirementFormAfter.controls['email'].value;
    if(email==''){
      this.postRequirementFormAfter.get('email').setErrors({ 'required': true });
    }else{
      if (this.postRequirementFormAfter.get('email').hasError['required'] == false) {
      this.postRequirementFormAfter.get('email').setErrors({ 'required': null });
      }
    }
    if (!this.postRequirementFormAfter.valid) {
    } else {
        this.postReq();
    }
  }
  
  back(){
    this.postBefore = true;
    this.postAfter = false;
  }
  postReq() {
    let postParams = {
      "userId": localStorage.getItem('userId'),
      "emailAddress": this.postRequirementFormAfter.controls['email'].value,
      "productName": this.postRequirementFormBefore.controls['productName'].value,
      "minqty": this.postRequirementFormBefore.controls['orderQuantity'].value,
      "minqtyunit": this.postRequirementFormBefore.controls['unit'].value,
      "deliveryLocation": this.postRequirementFormBefore.controls['deliveryLocation'].value,
      "userName": this.postRequirementFormAfter.controls['name'].value,
      "mobileNumber": this.postRequirementFormAfter.controls['mobile'].value,
      "allUploads": this.uploadedDocs,
      "actualLocation": this.selectedLocation,
      "actualProduct": this.selectedProduct,
      "additionalRequirement": this.postRequirementFormBefore.controls['requirement'].value,
      "requestFrom": "App"
    };
    //console.log(postParams);
    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present().then(() => {
      this.PR.postRequirement(postParams).then((result) => {
        let res: any = result;
        res = res.response;
        let pushNotifications = res.responseListObject.pushNotifications;
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
        //this.presentAlert(res.response.responseListObject.actingMessage)
         this.presentToast('Requirement Sent Successfully');
        this.navCtrl.setRoot('HomePage');
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
    }, (err) => {
      console.log(err);
    });
  }
  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Upload Pdf, Docs, Excel',
          handler: () => {
            this.uploadDoc();
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
  public takePicture(sourceType) {
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
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
              });
          } else {
            var currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
            var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
            this.corpth = correctPath;
            this.cornme = currentName;
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
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
  private copyFileToLocalDir(namePath, currentName, newFileName) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(this.type, this.imageId);
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

  public uploadImage(type, imageId) {
    var url = this.mainUrl+"TempFileImgUpload/imageUpload";
    var targetPath = this.pathForImage(this.lastImage);
    var filename = this.lastImage;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: { fileName: filename, userId: '587', updateStatus: type, imageId: imageId }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });
    this.loading.present();
    fileTransfer.upload(targetPath, url, options).then(data => {

      let datas = JSON.parse(data.response);

      this.uploadedDocs.push({
        "renamedFileName": datas.renamedFileName,
        "fileName": filename,
        "fileLink": datas.fileLink
      });
      this.loading.dismissAll()
      // this.presentToast('Image succesfully uploaded.');
      this.type = "New";
      this.imageId = '';
    }, err => {
      this.loading.dismissAll()
      this.presentToast(err.message + ' Error while uploading file.');
    });
  }

  updateImage(type, Ref_Image_Id) {
    this.type = type;
    this.imageId = Ref_Image_Id;
    this.presentActionSheet();
  }

  deleteImage(link) {
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
      console.log(data);
      this.imgDeleted = data;
      console.log(this.imgDeleted.response.responseObject);
      // this.presentToast(this.imgDeleted.response.responseObject);
      this.uploadedDocs.forEach(function (item, index, object) {
        if (item.fileLink === link) {
          object.splice(index, 1);
        }
      });
    }, err => {
      this.loading.dismissAll();
      console.log(err);
    });
  }



  uploadDoc() {
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
            this.loading = this.loadingCtrl.create({
              content: 'Uploading...',
            });
            this.loading.present();
            fileTransfer.upload(uri, url, options1)
              .then((data) => {
                // success
                let datas = JSON.parse(data.response);
                this.uploadedDocs.push({
                  "renamedFileName": datas.renamedFileName,
                  "fileName": this.currentfileName,
                  "fileLink": datas.fileLink
                });
                this.loading.dismiss();

              }, (err) => {
                // error
                this.loading.dismiss();
                console.log("error" + JSON.stringify(err));
              });
          }, (err) => {
            console.log(err);
          })
      })
      .catch(e => console.log(e));
  }

  openUnits(){
    let units = this.modalCtrl.create('PostReqUnitPage');
    units.present({ keyboardClose: false });
    units.onDidDismiss((data) => {
      if (data != null) {
          this.postRequirementFormBefore.get('unit').setValue(data.UnitName);
      }
    });
  }
}
