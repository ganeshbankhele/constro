import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import 'rxjs/add/operator/map';

@Injectable()
export class NotificationProvider {
  notificationCounterForAll = 0;
  currentUserNotifyAll: AngularFireList<any>;
  genUserAll: AngularFireList<any>;
  allNotifications: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  constructor(public http: HttpClient,
    public db: AngularFireDatabase) {

  }

  read() {
    this.currentUserNotifyAll = this.db.list('/usernotification/' + localStorage.getItem('userId'), refAll => localStorage.getItem('userId') ? refAll.limitToLast(5000) : refAll);
    this.allNotifications = this.currentUserNotifyAll.snapshotChanges().map(changes => {
      this.notificationCounterForAll = 0;
      return changes.map(allrec => {
        if (allrec.payload.val().isRead == 'No') {
          this.notificationCounterForAll = this.notificationCounterForAll + 1;
          let companyLogo = allrec.payload.val().icon;
          let redirectUrl = allrec.payload.val().redirectUrl;
          let message = allrec.payload.val().message;
          let userType = allrec.payload.val().userType;
          let requestType = allrec.payload.val().status;
          let requrestId = allrec.payload.val().id;
        }
        return allrec;
      }).slice().reverse();
    });
    return this.allNotifications;
  }

  readNotification() {
    return new Promise(resolve => {
      return this.read().subscribe(data => {
        resolve(this.currentUserNotifyAll);
      }, err => {
        console.log(err);
      });
    });


  }
  updateReadStatus(key: string) {
    this.currentUserNotifyAll.update(key, { isRead: 'Yes' });
  }
}
