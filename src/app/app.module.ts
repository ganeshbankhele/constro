import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { AuthProvider } from '../providers/auth/auth';
import { FCM } from '@ionic-native/fcm';
//import { SMS } from '@ionic-native/sms';
import { ComponentsModule } from '../components/components.module';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { FileChooser } from '@ionic-native/file-chooser';
//import { SQLite } from '@ionic-native/sqlite';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SecureStorage } from '@ionic-native/secure-storage';
import { BuyLeadProvider } from '../providers/buy-lead/buy-lead';
import { SearchProvider } from '../providers/search/search';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonClass } from '../providers/commonclass'
import { GetSearchQuoteProvider } from '../providers/get-search-quote/get-search-quote';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { Network } from '@ionic-native/network';
import { SocialSharing } from '@ionic-native/social-sharing';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { ImagePicker } from '@ionic-native/image-picker';
// import { DatePicker } from '@ionic-native/date-picker';
// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { NotificationProvider } from '../providers/notification/notification';
import { ProfileProvider } from '../providers/profile/profile'
//import { Firebase } from '@ionic-native/firebase';

// AF2 Settings
export const firebaseConfigTesting = {
  apiKey: "AIzaSyCuZcOcDdorjh1dmkVF29cuJlrr8wo1Z5E",
  authDomain: "testingcbnotifications.firebaseapp.com",
  databaseURL: "https://testingcbnotifications.firebaseio.com",
  projectId: "testingcbnotifications",
  storageBucket: "testingcbnotifications.appspot.com",
  messagingSenderId: "686502848749"
};

export const firebaseConfigLive = {
  apiKey: "AIzaSyCJmntrV8yXWt3TB1-srQhpGkSCXITMUg0",
  authDomain: "cb-web-5bf2d.firebaseapp.com",
  databaseURL: "https://cb-web-5bf2d.firebaseio.com",
  projectId: "cb-web-5bf2d",
  storageBucket: "cb-web-5bf2d.appspot.com",
  messagingSenderId: "1029861495419"
};

//import { PathLocationStrategy, LocationStrategy, APP_BASE_HREF  } from '@angular/common';
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfigTesting),
    AngularFireDatabaseModule,
    IonicModule.forRoot(MyApp, {
    //  locationStrategy: 'path'
    }),
    BrowserAnimationsModule, FormsModule, ReactiveFormsModule,
    IonicStorageModule.forRoot(), ComponentsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

  ],
  providers: [
    CommonClass,
    // Firebase,
    StatusBar, SecureStorage,
    SplashScreen, File,
    BuyLeadProvider,
    // DatePicker,
    FileTransfer,
    SpinnerDialog,
    SocialSharing,
    Camera, InAppBrowser,
    Network,ProfileProvider,
    FilePath, Crop, FileChooser,
    ImagePicker,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    FCM,
    SearchProvider,
    //SMS,
    //SQLite,
    Toast,
    GoogleAnalytics,
    GetSearchQuoteProvider,
    NotificationProvider,
    NotificationProvider,
   //  {provide: LocationStrategy, useClass: PathLocationStrategy}
  ]
})
export class AppModule { }
