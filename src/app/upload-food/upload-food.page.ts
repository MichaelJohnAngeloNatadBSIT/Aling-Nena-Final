import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { FoodsService } from "../services/foods.service";

@Component({
  selector: 'app-upload-food',
  templateUrl: './upload-food.page.html',
  styleUrls: ['./upload-food.page.scss'],
})
export class UploadFoodPage implements OnInit {
  foodForm: FormGroup;

  constructor(
    private foodService: FoodsService,
    private router: Router,
    public fb: FormBuilder
  ) { }

  ngOnInit() {
    this.foodForm = this.fb.group({
      name:[''],
      stocks:['']
    })
  }

  formSubmit() {
    if (!this.foodForm.valid) {
      return false;
    } else {
      this.foodService.createFood(this.foodForm.value).then(res => {
        console.log(res)
        this.foodForm.reset();
        this.router.navigate(['/posted-food']);
      })
        .catch(error => console.log(error));
    }
  }

}
