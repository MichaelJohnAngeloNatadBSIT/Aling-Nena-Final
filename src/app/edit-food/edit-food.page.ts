import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";
import { NavController } from '@ionic/angular';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { FoodsService } from '../services/foods.service';


export interface FILE {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.page.html',
  styleUrls: ['./edit-food.page.scss'],
})
export class EditFoodPage implements OnInit {
  // updateFoodForm: FormGroup;
  Category: any = ['Ulam/Food', 'Inumin/Beverages', 'Panghimagas/Dessert', 'Sabaw/Soups']
  id: any;

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

  // private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  errorMessage: string = '';
  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;

  constructor(
    private foodService: FoodsService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private navCtrl : NavController,
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.ngFirestoreCollection = afs.collection<FILE>('products');
    this.foodService.getFood(this.id).valueChanges().subscribe(res => {
      this.updateFoodForm.setValue(res);
    });
   }

  ngOnInit() {
    
  }

  updateFoodForm = this.fb.group({
    title:[''],
    price:[''],
    description:[''],
    category:[''],
    stock:[''],
    img:['']
  })

  changeCategory(e) {
    console.log(e.value)
    this.category.setValue(e.target.value, {
      onlySelf: true
    })
  }

  get category(){
    return this.updateFoodForm.get('category');
  }

  get title(){
    return this.updateFoodForm.get('title');
  }

  get stock(){
    return this.updateFoodForm.get('stock');
  }

  get description(){
    return this.updateFoodForm.get('description');
  }
  get price(){
    return this.updateFoodForm.get('price');
  }

  updateForm(image) {
    this.foodFileStorage(this.id, this.updateFoodForm.value, image);
    this.foodService.updateFood(this.id, this.updateFoodForm.value, image)
      .then(() => {
        this.router.navigate(['/posted-food']);
      })
      .catch(error => console.log(error));
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

    const fileStoragePath = `foodImages/${new Date().getTime()}_${file.name}`;

    const imageRef = this.afStorage.ref(fileStoragePath);

    this.ngFireUploadTask = this.afStorage.upload(fileStoragePath, file);

    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();

        this.fileUploadedPath.subscribe(resp=>{
          this.isImgUploading = false;
          this.isImgUploaded = true;
          // this.navCtrl.navigateBack(['/posted-food']);
        },error => {
          console.log(error);
        })
      }),
      tap(snap => {
          this.FileSize = snap.totalBytes;
      })
    )
  }

  foodFileStorage(id, food: FILE, img: string) {
    
    this.ngFirestoreCollection.doc(food.title).update({
      title: food.title,
      price: food.price,
      description: food.description,
      category: food.category,
      image: img,
      stock: food.stock,
    }).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }  
  
  backBttn(){

    this.navCtrl.navigateBack('/tabs');
  }
}
