import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadFoodPage } from './upload-food.page';

const routes: Routes = [
  {
    path: '',
    component: UploadFoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadFoodPageRoutingModule {}
