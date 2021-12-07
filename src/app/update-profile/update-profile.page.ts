import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { updateUser } from "../services/shared/updateUser";
import { finalize, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/compat/auth";

import { RegisterService } from '../services/register.service';
import { AuthenticationService } from "../services/authentication.service";

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.page.html',
  styleUrls: ['./update-profile.page.scss'],
})
export class UpdateProfilePage implements OnInit {
  credentials: FormGroup;

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

  imgPath: string;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
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
    this.credentials = this.fb.group({
      fullName: [''],
    },
    );

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

  // SetUserData(credentials, imgPath) {
  //   const id = this.afStore.createId();
  //   const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`usersInfo/${credentials.email}`);
  //   const userData: UserInfo = {
  //     uid: id,
  //     email: credentials.email,
  //     name: credentials.name,
  //     address: credentials.address,
  //     imagePath: imgPath
  //   }
  //   return userRef.set(userData, {
  //     merge: true
  //   })
  // }

  
  // Easy access for form fields
  // get email() {
  //   return this.credentials.get('email');
  // }
  
  // get password() {
  //   return this.credentials.get('password');
  // }

  get fullName() {
    return this.credentials.get('fullName');
  }

  // get address() {
  //   return this.credentials.get('address');
  // }
  // userName: string
  async UpdateProfile(credentials, imgPath: string, userEmail: string) {
    console.log(credentials);
    console.log("The Update is Successful")
    const profile = {
       displayName: credentials.fullName,
       photoURL: imgPath,
       email: userEmail,
    }
    return (await this.ngFireAuth.currentUser).updateProfile(profile);
  }

  uploadImage(event: FileList) {
      
    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `userImages/${new Date().getTime()}_${file.name}`;

    const imageRef = this.afStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.afStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();
        this.fileUploadedPath.subscribe(resp=>{
          
          this.UpdateProfile(this.credentials.value, resp, this.userEmail);

          this.navCtrl.navigateBack(['/tabs']);
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

  backTabs(){

    this.router.navigateByUrl("/tabs");
  }

  fileStorage(image: FILE) {
    const ImgId = this.afs.createId();
    
    this.ngFirestoreCollection.doc(ImgId).set(image).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }  
}
