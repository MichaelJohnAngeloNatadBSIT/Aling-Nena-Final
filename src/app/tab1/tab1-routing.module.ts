import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
  },
  {
    path: 'update-profile',
    loadChildren: () => import('../update-profile/update-profile.module').then( m => m.UpdateProfilePageModule)
  },
  {
    path: 'upload-food',
    loadChildren: () => import('../upload-food/upload-food.module').then( m => m.UploadFoodPageModule)
  },

  {
    path: 'posted-food',
    loadChildren: () => import('../posted-food/posted-food.module').then( m => m.PostedFoodPageModule)
  },

  {
    path: 'edit-food',
    loadChildren: () => import('../edit-food/edit-food.module').then( m => m.EditFoodPageModule)
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule {}
