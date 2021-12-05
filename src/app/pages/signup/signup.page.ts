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
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      name: ['', [Validators.required]],
    },
    );
  }
 
  // async register(fileUrl) {
  //   const loading = await this.loadingController.create();
  //   await loading.present();

  //   console.log("imgPath: "+fileUrl);
    
  //   this.regService.register(this.credentials.value).subscribe(
  //     async (res) => {
  //       await loading.dismiss(); 
  //       this.SetUserData(this.credentials.value, fileUrl);
  //       console.log(this.credentials.value);
  //       console.log("imgPath: "+this.imgPath);
  //       this.router.navigateByUrl('/tabs', { replaceUrl: true });
  //     },
  //     async (res) => {
  //       await loading.dismiss();
  //       const alert = await this.alertController.create({
  //         header: 'Register failed',
  //         message: res.error.error,
  //         buttons: ['OK'],
  //       });
 
  //       await alert.present();
  //     }
  //   );
  // }

  register() {
    this.regService.register(this.credentials.value)
      .then(res => {
        console.log(res);
        this.errorMessage = "";
        this.navCtrl.navigateForward('/tabs');
      }, err => {
        this.errorMessage = err.message;
      })
  }

  SetUserData(credentials, imgPath) {
    const id = this.afStore.createId();
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`usersInfo/${credentials.email}`);
    const userData: UserInfo = {
      uid: id,
      email: credentials.email,
      name: credentials.name,
      address: credentials.address,
      imagePath: imgPath
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

  get confirmPassword() {
    return this.credentials.get('confirmPassword');
  }


  get name() {
    return this.credentials.get('name');
  }

  get address() {
    return this.credentials.get('address');
  }

  fileUpload(event: FileList) {
      
    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `userImages/${new Date().getTime()}_${file.name}`;

    const imageRef = this.angularFireStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.angularFireStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();
        this.fileUploadedPath.subscribe(resp=>{
          this.fileStorage({
            name: file.name,
            filepath: resp,
            size: this.FileSize,
          });
          this.isImgUploading = false;
          this.isImgUploaded = true;
        },error => {
          console.log(error);
        })
      }),
      tap(snap => {
          this.FileSize = snap.totalBytes;
      })
    )
  }


fileStorage(image: FILE) {
    const ImgId = this.angularFirestore.createId();
    
    this.ngFirestoreCollection.doc(ImgId).set(image).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }  
}

//must do
// change profile pic using this https://firebase.google.com/docs/auth/web/manage-users
//target to finish tommorow