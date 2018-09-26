import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, Platform, Loading, LoadingController, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Camera } from "@ionic-native/camera";
import { Crop } from "@ionic-native/crop";
import { File } from '@ionic-native/file';
import { FilePath } from "@ionic-native/file-path";
import { CommonClass } from "../../providers/commonclass";
import { FileTransferObject, FileTransfer, FileUploadOptions } from "@ionic-native/file-transfer";
import { FileChooser } from "@ionic-native/file-chooser";
import { HttpHeaders, HttpClient } from "@angular/common/http";

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-profile-membership',
  templateUrl: 'profile-membership.html',
})
export class ProfileMembershipPage {

  data: any;
  trademark: any;
  brochures: any;
  imagesData: any;
  trademarkPdf: any;
  brochuresPdf: any;
  corpth: string = null;
  cornme: string = null;
  lastImage: string = null;
  loading: Loading;
  type: string = 'New';
  imageId: string;
  currentfileName;
  uploadedDocs: any = [];
  imgDeleted: any;
  mainUrl = "";

  constructor(public navCtrl: NavController,
    private crop: Crop,
    public authProvider: AuthProvider,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    private filePath: FilePath,
    private file: File,
    private transfer: FileTransfer,
    public com: CommonClass,
    private fileChooser: FileChooser,
    public http: HttpClient,
    public toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
    this.mainUrl = this.com.url;
    this.data = this.navParams.get('data');
    this.trademark = this.data.trademark;
    this.brochures = this.data.brochures;
    this.trademarkPdf = this.data.trademarkPdf;
    this.brochuresPdf = this.data.brochuresPdf;
    //  console.log(this.trademarkPdf);

    this.uploadedDocs = [];

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
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, DocType);
          }
        },
        {
          text: 'Use Camera',
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

  public presentActionSheetTred(DocType) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, DocType);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, DocType);
          }
        },
        //      {
        //        text: 'Upload Pdf, Docs, Excel',
        //        handler: () => {
        //          this.uploadDoc();
        //        }
        //      },

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
    this.loading.dismiss();
    fileTransfer.upload(targetPath, url, options).then(data => {

      let datas = JSON.parse(data.response);

      if (DocType == 'BR') {
        this.brochures.push({
          "Id": datas.resultData.ImageId,
          "Image": (datas.resultData.Image).replace(/\\/g, ""),
          "ShowImage": datas.resultData.ShowImage,
        });
      } else if (DocType == 'TRI') {
        this.trademark.push({
          "Id": datas.resultData.ImageId,
          "Image": (datas.resultData.Image).replace(/\\/g, ""),
          "ShowImage": datas.resultData.ShowImage,
        })
      }

      this.loading.dismissAll()
      this.presentToast('Image successfully uploaded.');

    }, err => {
      this.loading.dismissAll()
      this.presentToast(err.message + ' Error while uploading file.');
    });
  }

  uploadDoc() {
    var url = this.mainUrl + "TempFileImgUpload/fileUpload";
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

      this.presentToast('Image deleted successfully.');
      if (imageType == 'BR') {
        //  console.log(this.CompanyPhotos);
        this.brochures.forEach(function (item, index, object) {
          if (item.Id === i) {
            object.splice(index, 1);
          }
        });
      } else if (imageType == 'TRI') {
        this.trademark.forEach(function (item, index, object) {
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

  showConfirmAlert(link, imageType, i) {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete image',
      message: 'Are you sure you want to permanently delete this image?',
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

}
