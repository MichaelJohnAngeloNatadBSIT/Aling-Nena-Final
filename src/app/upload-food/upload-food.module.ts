import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentModule } from '../comp.module';

import { IonicModule } from '@ionic/angular';

import { UploadFoodPageRoutingModule } from './upload-food-routing.module';

import { UploadFoodPage } from './upload-food.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadFoodPageRoutingModule,
    ReactiveFormsModule,
    ComponentModule
  ],
  declarations: [UploadFoodPage]
})
export class UploadFoodPageModule {}
