import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentModule } from '../comp.module';

import { IonicModule } from '@ionic/angular';

import { EditFoodPageRoutingModule } from './edit-food-routing.module';

import { EditFoodPage } from './edit-food.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditFoodPageRoutingModule,
    ReactiveFormsModule,
    ComponentModule
  ],
  declarations: [EditFoodPage]
})
export class EditFoodPageModule {}
