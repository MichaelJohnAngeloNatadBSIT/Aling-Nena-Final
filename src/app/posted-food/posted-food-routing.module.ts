import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostedFoodPage } from './posted-food.page';

const routes: Routes = [
  {
    path: '',
    component: PostedFoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostedFoodPageRoutingModule {}
