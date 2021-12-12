import { Injectable } from '@angular/core';
import { food } from './shared/food';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class FoodsService {
  foodListRef: AngularFireList<any>;
  foodRef: AngularFireObject<any>;



  constructor( 
    private db: AngularFireDatabase,
    private afs: AngularFirestore
    ) { 
    this.foodListRef = db.list('/foodListRef');
  }

  // , image: string
  // Create
  createFood(apt: food, image: string) {
    return this.foodListRef.push({
      title: apt.title,
      price: apt.price,
      description: apt.description,
      category: apt.category,
      stock: apt.stock,
      img: image
    })
  }

  // Get Single
  getFood(id: string) {
    this.foodRef = this.db.object('/foodListRef/' + id);
    return this.foodRef;
  }

  // Get List
  getFoodList() {
    this.foodListRef = this.db.list('/foodListRef');
    return this.foodListRef;
  }

  // Update
  updateFood(id, apt: food, image:string) {
    return this.foodRef.update({
      title: apt.title,
      price: apt.price,
      description: apt.description,
      category: apt.category,
      stock: apt.stock,
      img: image
    })
  }

  // Delete
  deleteFood(id: string) {
    this.foodRef = this.db.object('/foodListRef/' + id);
    this.foodRef.remove();

    this.afs.collection('products').doc(id).delete();

  }
}
