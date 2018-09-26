import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController, Platform, ToastController, Loading, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { ProfileProvider } from '../../providers/profile/profile';
import { Camera } from "@ionic-native/camera";
import { Crop } from "@ionic-native/crop";
import { FilePath } from "@ionic-native/file-path";
import { File } from '@ionic-native/file';
import { CommonClass } from "../../providers/commonclass";
import { FileTransferObject, FileTransfer } from "@ionic-native/file-transfer";
import { HttpHeaders, HttpClient } from "@angular/common/http";


declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-profile-bankdetails',
  templateUrl: 'profile-bankdetails.html',
})
export class ProfileBankdetailsPage {
  bNameEdit: boolean = true;
  iNameEdit: boolean = true;
  aNameEdit: boolean = true;
  modeType = "Edit";
  data: any;
  bankForm;
  ccUrl: any;
  corpth: string = null;
  cornme: string = null;
  imagesSingleData: any;
  lastImage: string = null;
  loading: Loading;
  type: string = 'New'; imageId: string; currentfileName;
  mainUrl = "";
  imgDeleted: any;
  ccImage: any = [];
  uploadedDocs: any = [];

  constructor(public navCtrl: NavController,
    public authProvider: AuthProvider,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public profile: ProfileProvider,
    private file: File,
    public platform: Platform,
    private filePath: FilePath,
    private crop: Crop,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public com: CommonClass,
    public http: HttpClient,
    private transfer: FileTransfer,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public navParams: NavParams) {
    this.mainUrl = this.com.url;
    this.ccImage = [];
    this.uploadedDocs = [];
    this.data = this.navParams.get('data');

    this.bankForm = formBuilder.group({
      bankName: [this.data.bankName,Validators.maxLength(150)],
      bankIfscCode: [this.data.bankIFSCCode, Validators.compose([Validators.pattern('^[A-Za-z]{4}0[A-Z0-9a-z]{6}$'), Validators.minLength(11),])],
      bankAccountNo: [this.data.bankAccountNo],

    });

    this.ccUrl = this.data.ccUrl;


  }

  editMode() {
    if (this.modeType == 'Edit') {
      this.modeType = "Done";
      this.bNameEdit = false;
      this.iNameEdit = false;
      this.aNameEdit = false;

    } else {
      this.modeType = "Edit";
      this.bNameEdit = true;
      this.iNameEdit = true;
      this.aNameEdit = true;

    }
  }

  submitBankDetails() {
    if (!this.bankForm.valid) {

    } else {
      let parameter = {
        "User_Id": localStorage.getItem('userId'),
        "User_Type": localStorage.getItem('userType'),
        "bankName": this.bankForm.controls['bankName'].value,
        "bankifsccode": this.bankForm.controls['bankIfscCode'].value,
        "bankaccountno": this.bankForm.controls['bankAccountNo'].value
      }

      const loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.profile.bankUpdate(parameter).then((result) => {
          let all: any = result;
          if (all.response.status == 'Success') {

            let postParams = {
              "User_Id": localStorage.getItem('userId'),
              "User_Type": localStorage.getItem('userType'),
              "token": ""
            };
            //     this.modeType = 'Edit';
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
    //   this.loading.present();
    fileTransfer.upload(targetPath, url, options).then(data => {
  //    const alert = this.alertCtrl.create({
  //      title: 'response',
  //      message: '=>' + data.response,
  //      buttons: ['OK']
  //    });
  //    alert.present();
      let datas = JSON.parse(data.response);

      if (DocType == 'CC') {
        this.data.ccUrl = (datas.resultData.Image).replace(/\\/g, "");
      }

      this.loading.dismiss()
      this.presentToast('Image successfully uploaded.');

    }, err => {
      this.loading.dismiss()
      this.presentToast(err.message + ' Error while uploading file.');
    });
  }

  deleteImage(link) {
    this.loading = this.loadingCtrl.create({
      content: 'Deleteing...',
    });
    this.loading.present();
    const url = this.mainUrl + "TempFileImgDelete/deleteFileImg";
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

}
