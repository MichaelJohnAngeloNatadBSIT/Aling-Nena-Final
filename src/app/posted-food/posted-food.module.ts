import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostedFoodPageRoutingModule } from './posted-food-routing.module';

import { PostedFoodPage } from './posted-food.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PostedFoodPageRoutingModule
  ],
  declarations: [PostedFoodPage]
})
export class PostedFoodPageModule {}
