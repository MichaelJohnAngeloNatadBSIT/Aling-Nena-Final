import { Injectable } from '@angular/core';
import { food } from './shared/food';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class FoodsService {
  foodListRef: AngularFireList<any>;
  foodRef: AngularFireObject<any>;

  constructor( private db: AngularFireDatabase ) { }

  
  // Create
  createFood(apt: food) {
    return this.foodListRef.push({
      name: apt.name,
      stocks: apt.stocks
    })
  }

  // Get Single
  getFood(id: string) {
    this.foodRef = this.db.object('/food/' + id);
    return this.foodRef;
  }

  // Get List
  getFoodList() {
    this.foodListRef = this.db.list('/food');
    return this.foodListRef;
  }

  // Update
  updateFood(id, apt: food) {
    return this.foodRef.update({
      name: apt.name,
      stocks: apt.stocks
    })
  }

  // Delete
  deleteFood(id: string) {
    this.foodRef = this.db.object('/food/' + id);
    this.foodRef.remove();
  }
}
