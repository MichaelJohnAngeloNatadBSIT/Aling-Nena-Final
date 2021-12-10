import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from "../services/shared/userInfo";
import  firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireAuth } from "@angular/fire/compat/auth";

import { NavController, ViewWillEnter } from '@ionic/angular';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  refresher = document.getElementById('refresher');

  userEmail: string;
  userImage: string;
  userName: string;

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
 
  constructor(
    private afStorage: AngularFireStorage, 
    private authService: AuthenticationService, 
    private router: Router, 
    private afs: AngularFirestore, 
    private navCtrl: NavController,
    public ngFireAuth: AngularFireAuth,
    ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
    
    this.ngFirestoreCollection = afs.collection<FILE>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }
  

  ngOnInit() {

    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
        this.userName = res.displayName;
        this.userImage = res.photoURL;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
        this.userName = res.displayName;
        this.userImage = res.photoURL;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 1000);
  }


async UpdateProfile(userName: string, imgPath: string, userEmail: string) {
  console.log("The Update is Successful")
  const profile = {
     displayName: userName,
     photoURL: imgPath,
     email: userEmail,
  }
  return (await this.ngFireAuth.currentUser).updateProfile(profile);
}

  updatePage(){
    this.navCtrl.navigateForward(['update-profile'])
  }

  uploadFood(){
    this.navCtrl.navigateForward(['upload-food'])
  }

  postedFood(){
    this.navCtrl.navigateForward(['posted-food'])
  }

  editFood(){
    this.navCtrl.navigateForward(['edit-food/:id'])
  }

  userDetails() {
    return this.ngFireAuth.user;
  }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}

