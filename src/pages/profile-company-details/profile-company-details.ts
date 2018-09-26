import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingController, ActionSheetController, Platform, ToastController, Loading, AlertController, ModalController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { ProfileProvider } from '../../providers/profile/profile';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from "@ionic-native/crop";
import { File } from '@ionic-native/file';
import { FilePath } from "@ionic-native/file-path";
import { CommonClass } from "../../providers/commonclass";
import { FileTransferObject, FileTransfer } from "@ionic-native/file-transfer";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { SearchProvider } from "../../providers/search/search";

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-profile-company-details',
  templateUrl: 'profile-company-details.html',
})
export class ProfileCompanyDetailsPage {

  Country_Id = 1;
  State_Id = 0;
  City_Id = 0;
  Company_Location_Id = 0;
  PIN_Cod = "";
  data: any;
  compForm;
  trademarkPhotos: any;
  CompanyPhotos: any;
  imagesData: any;
  imagesSingleData: any;
  panScannedCopy: any;
  gstScannedCopy: any;
  tinScannedCopy: any;
  cstScannedCopy: any;
  Company_Logo: any;
  modeType = "Edit";
  loading: Loading;
  lastImage: string = null;
  readcompanyShortName: boolean = true;
  readcompanyFullName: boolean = true;
  readcompanyDescription: boolean = true;
  readcompanyAddress: boolean = true;
  readcompanyContactPersonName: boolean = true;
  readcompanyContactPersonEmail: boolean = true;
  readcompanyContactPersonNumber: boolean = true;
  readcompanyLocation: boolean = true;
  readwebsite: boolean = true;
  readvideoLink: boolean = true;
  readgstNumber: boolean = true;
  readpanNo: boolean = true;
  readtinNo: boolean = true;
  corpth: string = null;
  cornme: string = null;
  type: string = 'New'; imageId: string; currentfileName;
  mainUrl = "";
  imgDeleted: any;
  uploadedDocs: any = [];

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    private crop: Crop,
    public navParams: NavParams,
    public profile: ProfileProvider,
    public authProvider: AuthProvider,
    private camera: Camera,
    private imagePicker: ImagePicker,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private filePath: FilePath,
    private alertCtrl: AlertController,
    private transfer: FileTransfer,
    private file: File,
    public com: CommonClass,
    public http: HttpClient,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public sP: SearchProvider,
    public actionSheetCtrl: ActionSheetController,
  ) {
    this.mainUrl = this.com.url;
    this.uploadedDocs = [];
    this.data = this.navParams.get('data');
    this.compForm = formBuilder.group({
      companyShortName: [this.data.companyShortName],
      companyFullName: [this.data.companyFullName, Validators.compose([Validators.maxLength(80)])],
      companyDescription: [this.data.companyDescription, Validators.compose([Validators.maxLength(500)])],
      companyAddress: [this.data.companyAddress, Validators.compose([Validators.maxLength(250)])],
      companyContactPersonName: [this.data.companyContactPersonName, Validators.compose([Validators.maxLength(30)])],
      companyContactPersonEmail: [this.data.companyContactPersonEmail, Validators.compose([Validators.maxLength(100)])],
      companyContactPersonNumber: [this.data.companyContactPersonNumber, Validators.compose([Validators.maxLength(20)])],
      companyLocation: [this.data.companyLocation],
      website: [this.data.website],
      videoLink: [this.data.videoLink],
      gstNumber: [this.data.gstNumber, Validators.compose([Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')])],
      panNo: [this.data.panNo, Validators.compose([Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}$')])],
      tinNo: [this.data.tinNo, Validators.maxLength(12)]
      //  fileUploads: ''


    });
    this.panScannedCopy = this.data.panScannedCopy;
    this.gstScannedCopy = this.data.gstScannedCopy;
    this.tinScannedCopy = this.data.tinScannedCopy;
    this.cstScannedCopy = this.data.cstScannedCopy;
    this.trademarkPhotos = this.data.trademarkPhotos;
    this.CompanyPhotos = this.data.CompanyPhotos;
    this.Company_Logo = this.data.Company_Logo;

  }

  ionViewDidLoad() {

  }

  editMode() {
    if (this.modeType == 'Edit') {
      this.modeType = "Done";
      this.readcompanyShortName = false;
      this.readcompanyFullName = false;
      this.readcompanyDescription = false;
      this.readcompanyAddress = false;
      this.readcompanyContactPersonName = false;
      this.readcompanyContactPersonEmail = false;
      this.readcompanyContactPersonNumber = false;
      this.readcompanyLocation = false;
      this.readwebsite = false;
      this.readvideoLink = false;
      this.readgstNumber = false;
      this.readpanNo = false;
      this.readtinNo = false;

    } else {
      this.modeType = "Edit";
      this.readcompanyShortName = true;
      this.readcompanyFullName = true;
      this.readcompanyDescription = true;
      this.readcompanyAddress = true;
      this.readcompanyContactPersonName = true;
      this.readcompanyContactPersonEmail = true;
      this.readcompanyContactPersonNumber = true;
      this.readcompanyLocation = true;
      this.readwebsite = true;
      this.readvideoLink = true;
      this.readgstNumber = true;
      this.readpanNo = true;
      this.readtinNo = true;

    }
  }

  submitCompDetails() {
    // companyShortName
    // companyFullName   
    // companyLocation
    // videoLink
    if (!this.compForm.valid) {

    } else {
      let compDetails = {
        "Country_Id": this.Country_Id,
        "State_Id": this.State_Id,
        "City_Id": this.City_Id,
        "Company_Location_Id": this.Company_Location_Id,
        "PIN_Code": this.PIN_Cod,
        "companyLocation": this.compForm.value.companyLocation,
        "User_Id": localStorage.getItem('userId'),
        "User_Type": localStorage.getItem('userType'),
        "companyAddress": this.compForm.value.companyAddress,
        "companyContactPersonEmail": this.compForm.value.companyContactPersonEmail,
        "companyContactPersonName": this.compForm.value.companyContactPersonName,
        "companyContactPersonNumber": this.compForm.value.companyContactPersonNumber,
        "companyDescription": this.compForm.value.companyDescription,
        "allUploads": this.uploadedDocs,
        "website": this.compForm.value.website
      }
      let gstPara = {
        "User_Id": localStorage.getItem('userId'),
        "User_Type": localStorage.getItem('userType'),
        "gstnumber": this.compForm.gstNumber
      }
      let panPara = {
        "User_Id": localStorage.getItem('userId'),
        "User_Type": localStorage.getItem('userType'),
        "pannumber": this.compForm.panNo
      }
      let tinPara = {
        "User_Id": localStorage.getItem('userId'),
        "User_Type": localStorage.getItem('userType'),
        "tinnumber": this.compForm.tinNo
      }

      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.profile.companyDetailsUpdate(compDetails).then((result) => {
          let all: any = result;
          if (all.response.status == 'Success') {
            let today = new Date();
            let postParams = {
              "User_Id": localStorage.getItem('userId'),
              "User_Type": localStorage.getItem('userType'),
              "token": ""
            };
            //      this.modeType = 'Edit';
            this.profile.loadProfile(postParams).then((res) => { });
            loading.dismiss();
            this.navCtrl.setRoot('ProfilePage');
          } else {
            loading.dismiss();
          }
        }, (err) => {
          console.log(err);
          loading.dismiss();
        });
      });
    }

  }


  openImageSingle(url, id) {
    this.imagesSingleData = {
      url: url,
      id: id
    };
    this.navCtrl.push('ImageEditPage', { "data": this.imagesSingleData });
  }

  openImage(imgData) {
    this.imagesData = {
      url: imgData.Image,
      id: imgData.id
    };
    this.navCtrl.push('ImageEditPage', { "data": this.imagesData });
  }

  public presentActionSheet(DocType) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, DocType);
          }
        },
        {
          text: 'Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, DocType);
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

  public takePicture(sourceType, DocType) {
    // Create options for the Camera Dialog
    var options = {
      //  quality: 10,
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
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), DocType);
              });
          } else {
            var currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
            var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
            this.corpth = correctPath;
            this.cornme = currentName;
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), DocType);
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
  private copyFileToLocalDir(namePath, currentName, newFileName, DocType) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(DocType);
    }, error => {
      this.presentToast('Error while storing file.');
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

  public uploadImage(DocType) {
    var url = this.mainUrl + "TempFileImgUpload/fileUpload";
    var targetPath = this.pathForImage(this.lastImage);
    var filename = this.lastImage;
    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params: {
        fileName: filename,
        User_Id: localStorage.getItem('userId'),
        //  updateStatus: type,
        //  imageId: imageId,
        DocType: DocType,
        Request_From: "App",
        sellerProductId: 0,
        isImageUploadedtoTemp: "No",
      }
    };
    const fileTransfer: FileTransferObject = this.transfer.create();
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...',
    });


    fileTransfer.upload(targetPath, url, options).then(data => {
      //   var resultData=resultData.replace(/\\/g, "");
      //   const alert = this.alertCtrl.create({
      //     title: 'response',
      //     message: '=>' + data.response,
      //     buttons: ['OK']
      //   });
      //   alert.present();
      let datas = JSON.parse(data.response);


      if (DocType == 'CP') {
        this.CompanyPhotos.push({
          "Id": datas.resultData.ImageId,
          "Image": (datas.resultData.Image).replace(/\\/g, ""),
          "ShowImage": datas.resultData.ShowImage,
        });
      } else if (DocType == 'GST') {
        this.data.gstScannedCopy = (datas.resultData.Image).replace(/\\/g, "");
      } else if (DocType == 'PA') {
        this.data.panScannedCopy = (datas.resultData.Image).replace(/\\/g, "");
      } else if (DocType == 'TI') {
        this.data.tinScannedCopy = (datas.resultData.Image).replace(/\\/g, "");
      } else if (DocType == 'CST') {
        this.data.cstScannedCopy = (datas.resultData.Image).replace(/\\/g, "");
      } else if (DocType == 'LO') {
        this.data.Company_Logo = (datas.resultData.Image).replace(/\\/g, "");
      }

      this.loading.dismiss()
      this.presentToast('Image successfully uploaded.');

    }, err => {
      this.loading.dismiss()
      this.presentToast(err.message + ' Error while uploading file.');
    });
  }

  updateImage(type, Ref_Image_Id) {
    this.type = type;
    this.imageId = Ref_Image_Id;
    //   this.presentActionSheet();
  }

  deleteImage(link, imageType, i) {
    this.loading = this.loadingCtrl.create({
      content: 'Deleteing...',
    });
    this.loading.present();
    const url = this.mainUrl + "Fileupload/deletefiles";
    var headers = new HttpHeaders();
    headers.append("Accept", "application/json");
    let postParams = {
      Image_Id: link,
      ImageType: imageType,
      User_Id: localStorage.getItem('userId'),
      RequsetFrom: "App"
    };
    this.http.post(url, JSON.stringify(postParams), { headers: headers }).subscribe(data => {
      this.loading.dismissAll();
      this.imgDeleted = data;
      console.log(this.imgDeleted.response.responseObject);

      //  this.presentToast(this.imgDeleted.response.responseObject);
      this.presentToast('Image deleted successfully.');
      if (imageType == 'CP') {
        //  console.log(this.CompanyPhotos);
        this.CompanyPhotos.forEach(function (item, index, object) {
          if (item.Id === i) {
            object.splice(index, 1);
          }
        });


      }
    }, err => {
      this.loading.dismissAll();
      console.log(err);
    });
  }

  showDeleteAlert(link, imageType, i) {
    let alert = this.alertCtrl.create({
      title: 'Are you sure you want to delete this image?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.deleteImage(link, imageType, i);

          }
        }
      ]
    });
    alert.present();
  }

  locationSearch() {
    let locationModal = this.modalCtrl.create('LocationCompanyPage');
    locationModal.present({ keyboardClose: false });
    locationModal.onDidDismiss((result) => {
      if (result != null) {
        this.data.companyLocation = result.Location;
        this.Country_Id = result.Country_Id;
        this.State_Id = result.State_Id;
        this.City_Id = result.City_Id;
        this.Company_Location_Id = result.Location_Id;
        this.PIN_Cod = result.PIN_Code;

        //    this.sP.product_search.country_id = data.Country_Id;
        //    this.sP.product_search.state_id = data.State_Id;
        //    this.sP.product_search.city_id = data.City_Id;
        //    this.sP.product_search.location_id = data.Location_Id;
        //    this.sP.product_search.Location_Name = data.Location;



      }
    });
  }

}
