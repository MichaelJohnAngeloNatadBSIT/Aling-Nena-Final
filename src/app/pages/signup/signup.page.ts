import { RegisterService } from './../../services/register.service';
import { AuthenticationService } from "./../../services/authentication.service";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { UserInfo } from "../../services/shared/userInfo";
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';


export interface FILE {
  name: string;
  filepath: string;
  size: number;
}
 
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  credentials: FormGroup;

  ngFireUploadTask: AngularFireUploadTask;

  progressNum: Observable<number>;

  progressSnapshot: Observable<any>;

  fileUploadedPath: Observable<string>;

  files: Observable<FILE[]>;

  FileName: string;
  FileSize: number;

  isImgUploading: boolean;
  isImgUploaded: boolean;

  imgPath: string;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  errorMessage: string = '';
  constructor(
    private fb: FormBuilder,
    private regService: RegisterService,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    public afStore: AngularFirestore,
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,
    private navCtrl: NavController,
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
    
    this.ngFirestoreCollection = angularFirestore.collection<FILE>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
  }
  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    },
    );
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    
    this.regService.register(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss(); 
        console.log(this.credentials.value);
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Register failed',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }


  SetUserData(credentials,) {
    const id = this.afStore.createId();
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`usersInfo/${credentials.email}`);
    const userData: UserInfo = {
      uid: id,
      email: credentials.email,
    }
    return userRef.set(userData, {
      merge: true
    })
  }

 
  // Easy access for form fields
  get email() {
    return this.credentials.get('email');
  }
  
  get password() {
    return this.credentials.get('password');
  }

  get name() {
    return this.credentials.get('name');
  }

  get address() {
    return this.credentials.get('address');
  }

}
