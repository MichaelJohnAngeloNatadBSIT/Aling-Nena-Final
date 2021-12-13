import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import  firebase from 'firebase/compat/app';
import { User } from "./shared/user";

import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
 
import { Storage } from '@capacitor/storage';
import { environment } from 'src/environments/environment';

 
const TOKEN_KEY = 'my-token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  userData: any;
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
 
  constructor(
    private http: HttpClient, 
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone) {

      this.ngFireAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      })
    this.loadToken();
  }
 
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  login(credentials: {email, password}) {
    return new Promise<any>((resolve, reject) => {
      this.ngFireAuth.signInWithEmailAndPassword(credentials.email, credentials.password)
        .then(
          res => resolve(res),
          err => reject(err))

          this.isAuthenticated.next(true);
    })
  }


  // Sign in with Facebook
  FacebookAuth() {
    this.isAuthenticated.next(true);
    return this.AuthLogin(new firebase.auth.FacebookAuthProvider());
  }  


  // Sign in with Gmail
  GoogleAuth() {
    this.isAuthenticated.next(true);
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return this.ngFireAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['tabs']);
        })
      this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`usersInfo/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  userDetails() {
    return this.ngFireAuth.user;
  }

  getUser(email: string) {
    return this.afStore.collection('usersInfo').doc(email).get();
 }
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.ngFireAuth.signOut();
    return Storage.remove({key: TOKEN_KEY});
  }
}