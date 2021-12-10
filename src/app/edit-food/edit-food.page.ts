import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormGroup, FormBuilder } from "@angular/forms";

import { FoodsService } from '../services/foods.service';

@Component({
  selector: 'app-edit-food',
  templateUrl: './edit-food.page.html',
  styleUrls: ['./edit-food.page.scss'],
})
export class EditFoodPage implements OnInit {
  updateFoodForm: FormGroup;
  id: any;

  constructor(
    private foodService: FoodsService,
    private actRoute: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');
    this.foodService.getFood(this.id).valueChanges().subscribe(res => {
      this.updateFoodForm.setValue(res);
    });
   }

  ngOnInit() {
    this.updateFoodForm = this.fb.group({
      name: [''],
      stocks: [''],
    })
    console.log(this.updateFoodForm.value)
  }

  updateForm() {
    this.foodService.updateFood(this.id, this.updateFoodForm.value)
      .then(() => {
        this.router.navigate(['/posted-food']);
      })
      .catch(error => console.log(error));
  }

}
