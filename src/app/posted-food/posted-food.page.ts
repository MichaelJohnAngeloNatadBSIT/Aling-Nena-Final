import { Component, OnInit } from '@angular/core';
import { food } from '../services/shared/food';
import { FoodsService } from '../services/foods.service';


@Component({
  selector: 'app-posted-food',
  templateUrl: './posted-food.page.html',
  styleUrls: ['./posted-food.page.scss'],
})
export class PostedFoodPage implements OnInit {
  Foods = [];

  constructor( private foodService: FoodsService ) { }

  ngOnInit() {
    this.fetchFoods();
    let foodRes = this.foodService.getFoodList();
    foodRes.snapshotChanges().subscribe(res => {
      this.Foods = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.Foods.push(a as food);
      })
    })

  }

  fetchFoods() {
    this.foodService.getFoodList().valueChanges().subscribe(res => {
      console.log(res)
    })
  }

  deleteFood(id) {
    console.log(id)
    if (window.confirm('Do you really want to delete?')) {
      this.foodService.deleteFood(id)
    }
  }

}
