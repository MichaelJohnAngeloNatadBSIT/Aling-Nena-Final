import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FoodsService } from "../services/foods.service";
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}


@Component({
  selector: 'app-upload-food',
  templateUrl: './upload-food.page.html',
  styleUrls: ['./upload-food.page.scss'],
})
export class UploadFoodPage implements OnInit {
  foodForm: FormGroup;

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
    private foodService: FoodsService,
    private router: Router,
    public fb: FormBuilder,
    private afStorage: AngularFireStorage, 
    // private authService: AuthenticationService, 
    // private router: Router, 
    private afs: AngularFirestore, 
    private navCtrl: NavController,
    // public ngFireAuth: AngularFireAuth,
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;

    this.ngFirestoreCollection = afs.collection<FILE>('foodImageCollection');
    this.files = this.ngFirestoreCollection.valueChanges();
   }

  ngOnInit() {
    this.foodForm = this.fb.group({
      name:[''],
      stocks:[''],
    })
  }

  // imageUpload(event: FileList){
  //   const file = event.item(0)
  //   // console.log(file);
  //   if (file.type.split('/')[0] !== 'image') { 
  //     console.log('File type is not supported!')
  //     return;
  //   }

  //   this.FileName = file.name;

  //   const fileStoragePath = `foodImages/${new Date().getTime()}_${file.name}`;

  //   const imageRef = this.afStorage.ref(fileStoragePath);

  //   this.ngFireUploadTask = this.afStorage.upload(fileStoragePath, file);

  //   this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
  //     finalize(() => {
  //       this.fileUploadedPath = imageRef.getDownloadURL();

  //       this.fileUploadedPath.subscribe(resp=>{
          
  //         // this.UpdateProfile(this.credentials.value, resp, this.userEmail);

  //         // this.navCtrl.navigateBack(['/tabs']);
  //         this.fileStorage({
  //           name: file.name,
  //           filepath: resp,
  //           size: this.FileSize,
  //         });
  //         // this.isImgUploading = false;
  //         // this.isImgUploaded = true;
  //         console.log(resp);
  //         this.formSubmit(resp);
  //       },error => {
  //         console.log(error);
  //       })
  //   }),
  //   tap(snap => {
  //       this.FileSize = snap.totalBytes;
  //   })
  //   )
   
  // }

  uploadImage(event: FileList) {
      
    const file = event.item(0)

    if (file.type.split('/')[0] !== 'image') { 
      console.log('File type is not supported!')
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;

    this.FileName = file.name;

    const fileStoragePath = `foodImages/${new Date().getTime()}_${file.name}`;

    const imageRef = this.afStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.afStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          console.log(resp);
        

          // this.navCtrl.navigateBack(['/posted-food']);
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
    const ImgId = this.afs.createId();
    
    this.ngFirestoreCollection.doc(ImgId).set(image).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }  

  formSubmit(image) {
    if (!this.foodForm.valid) {
      return false;
    } else {
        this.foodService.createFood(this.foodForm.value, image).then(res => {
          console.log(res)
          this.foodForm.reset();
          this.router.navigate(['/posted-food']);
        })
          .catch(error => console.log(error));
    }
  }


}
