import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { User } from "./shared/user";
import { AngularFireAuth } from "@angular/fire/compat/auth";
 
import { Storage } from '@capacitor/storage';

 
const TOKEN_KEY = 'my-token';
 
@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';
 
  constructor(
    private http: HttpClient, 
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,) {
    this.loadToken();
  }
 
  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });    
    if (token && token.value) {
      console.log('set token: ', token.value);
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
 
  register(credentials: {email, password}): Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=`+environment.firebase.apiKey, credentials).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({key: TOKEN_KEY, value: token}));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
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
 
  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.ngFireAuth.signOut();
    return Storage.remove({key: TOKEN_KEY});
  }
}