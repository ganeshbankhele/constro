import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, ToastController, LoadingController, Loading, AlertController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth';
import { Camera } from "@ionic-native/camera";
import { Crop } from "@ionic-native/crop";
import { FilePath } from "@ionic-native/file-path";
import { File } from '@ionic-native/file';
import { CommonClass } from "../../providers/commonclass";
import { FileTransferObject, FileTransfer, FileUploadOptions } from "@ionic-native/file-transfer";
import { FileChooser } from "@ionic-native/file-chooser";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { ProfileProvider } from "../../providers/profile/profile";
import { FormBuilder, Validators } from '@angular/forms';

declare var cordova: any;
@IonicPage()
@Component({
  selector: 'page-profile-awards',
  templateUrl: 'profile-awards.html',
})
export class ProfileAwardsPage {
  description: any;
  descriptionInfo: any;
  descriptionForm;
  data: any;
  membershipPhotos: any;
  imagesData: any;
  awardsPhotos: any;
  lastImage: string = null;
  corpth: string = null;
  cornme: string = null;
  type: string = 'New';
  loading: Loading;
  imageId: string;
  currentfileName;
  uploadedDocs: any = [];
  imgDeleted: any;
  mainUrl = "";
  constructor(public navCtrl: NavController,
    public authProvider: AuthProvider,
    private camera: Camera,
    public formBuilder: FormBuilder,
    private crop: Crop,
    public platform: Platform,
    private file: File,
    private filePath: FilePath,
    public toastCtrl: ToastController,
    public com: CommonClass,
    private transfer: FileTransfer,
    private fileChooser: FileChooser,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public profile: ProfileProvider,
    public actionSheetCtrl: ActionSheetController,
    public navParams: NavParams) {




    this.mainUrl = this.com.url;
    this.data = this.navParams.get('data');
    this.awardsPhotos = this.data.awardsPhotos;
    this.membershipPhotos = this.data.membershipPhotos;
    this.uploadedDocs = [];


  }

  openImage(imgData) {
    this.imagesData = {
      url: imgData.Image,
      id: imgData.id
    };
    this.navCtrl.push('ImageEditPage', { "data": this.imagesData });
  }

  public presentActionSheet(ImgId, DocType, Desc) {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY, ImgId, DocType, Desc);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA, ImgId, DocType, Desc);
          }
        },
        //     {
        //       text: 'Upload Pdf, Docs, Excel',
        //      handler: () => {
        //         this.uploadDoc(DocType, APDF);
        //      }
        //    },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  public takePicture(sourceType, ImgId, DocType, Desc) {
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
                this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), ImgId, DocType, Desc);
              });
          } else {
            var currentName = newImage.substring(newImage.lastIndexOf('/') + 1, newImage.lastIndexOf('?'));
            var correctPath = newImage.substr(0, newImage.lastIndexOf('/') + 1);
            this.corpth = correctPath;
            this.cornme = currentName;
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName(), ImgId, DocType, Desc);
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
  private copyFileToLocalDir(namePath, currentName, newFileName, ImgId, DocType, Desc) {
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
      this.lastImage = newFileName;
      this.uploadImage(ImgId, DocType, Desc);
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

  public uploadImage(ImgId, DocType, Desc) {
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
    this.loading.present();
    fileTransfer.upload(targetPath, url, options).then(data => {

      let datas = JSON.parse(data.response);
      if (DocType == 'AI') {
        this.awardsPhotos.push({
          "Id": datas.resultData.ImageId,
          "Image": (datas.resultData.Image).replace(/\\/g, ""),
          "ShowImage": datas.resultData.ShowImage,
        });
      } else if (DocType == 'MI') {
        this.membershipPhotos.push({
          "Id": datas.resultData.ImageId,
          "Image": (datas.resultData.Image).replace(/\\/g, ""),
          "ShowImage": datas.resultData.ShowImage,
        });
      }
      this.loading.dismissAll()
      this.presentToast('Image succesfully uploaded.');
      this.presentPrompt(ImgId, DocType, Desc);

    }, err => {
      this.loading.dismissAll()
      this.presentToast(err.message + ' Error while uploading file.');
    });
  }

  uploadDoc(DocType, APDF) {
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
                this.membershipPhotos.push({
                  "Id": "",
                  "Image": "https://www.constrobazaar.com/api/assets/images/noimage.png",
                  "ShowImage": "block",
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

  presentPrompt(ImgId, DocType, Desc) {
    let alert = this.alertCtrl.create({
      title: 'Do you want to add description?',
      inputs: [
        {
          name: 'Description',
          placeholder: 'Description',
          type: 'text',
          id: 'Description',
          value: Desc.Description
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
    
          }
        },
        {
          text: 'Submit',
          handler: data => {
        
            if (data.Description.length > 150) {
              
              this.presentToast('Maximum size should be 150');
            } else {
              this.addDescription(ImgId, DocType, data.Description, Desc);
             
            }

          }
        }
      ]
    });
    alert.present();
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
      console.log(data);
      this.imgDeleted = data;
      console.log(this.imgDeleted.response.responseObject);

      //  this.presentToast(this.imgDeleted.response.responseObject);
      this.presentToast('Image deleted successfully.');
      if (imageType == 'AI') {
        //  console.log(this.CompanyPhotos);
        this.awardsPhotos.forEach(function (item, index, object) {
          if (item.Id === i) {
            object.splice(index, 1);
          }
        });
      } else if (imageType == 'MI') {
        this.membershipPhotos.forEach(function (item, index, object) {
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

  addDescription(ImgId, DocType, Description, Desc) {
    let parameter = {
      "userId": localStorage.getItem('userId'),
      "imageId": ImgId,
      "uploadType": DocType,
      "description": Description,
      "requestFrom": 'App',
      "token": ""
    };


    const loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present().then(() => {
      this.profile.descriptionUpdate(parameter).then((result) => {
        let all: any = result;
        if (all.response.status == 'Success') {
          Desc.Description = Description;
          let postParams = {
            "User_Id": localStorage.getItem('userId'),
            "User_Type": localStorage.getItem('userType'),
            "token": ""
          };

          this.profile.loadProfile(postParams).then((res) => { });



          loading.dismiss();
          //    this.navCtrl.setRoot('ProfileAwardsPage');
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
