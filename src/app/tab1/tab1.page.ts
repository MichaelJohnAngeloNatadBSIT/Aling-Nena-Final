import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfo } from "../services/shared/userInfo";
import  firebase from 'firebase/compat/app';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

import { NavController } from '@ionic/angular';

 
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  userEmail: string;
  userImage: string;
  userName: string;

  public userData: any;

  ngFirestore: AngularFirestore;
 
  constructor(private authService: AuthenticationService, private router: Router, private afs: AngularFirestore, private navCtrl: NavController) {}
  

  ngOnInit() {

    this.authService.userDetails().subscribe(res => {
      console.log('res', res);
      if (res !== null) {
        this.userEmail = res.email;
        this.userImage = res.photoURL;
        this.userName = res.displayName;
      } else {
        this.navCtrl.navigateBack('');
      }
    }, err => {
      console.log('err', err);
    })
  }




  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}