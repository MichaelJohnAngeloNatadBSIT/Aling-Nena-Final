import { Injectable } from '@angular/core';
import { food } from './shared/food';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {
  foodListRef: AngularFireList<any>;
  foodRef: AngularFireObject<any>;

  constructor( private db: AngularFireDatabase ) { 
    this.foodListRef = db.list('/foodListRef');
  }

  
  // Create
  createFood(apt: food, image: string) {
    return this.foodListRef.push({
      name: apt.name,
      stocks: apt.stocks,
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
      name: apt.name,
      stocks: apt.stocks,
      img: image
    })
  }

  // Delete
  deleteFood(id: string) {
    this.foodRef = this.db.object('/foodListRef/' + id);
    this.foodRef.remove();
  }
}
