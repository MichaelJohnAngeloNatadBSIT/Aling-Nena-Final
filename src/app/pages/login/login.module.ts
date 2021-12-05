import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

 
import { IonicModule } from '@ionic/angular';
 
import { LoginPageRoutingModule } from './login-routing.module';
 
import { LoginPage } from './login.page';

import { ShowHidePasswordComponent } from 'src/app/show-hide-password/show-hide-password.component';
 
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    ReactiveFormsModule
  ],
  entryComponents: [ShowHidePasswordComponent],
  declarations: [LoginPage, ShowHidePasswordComponent]
})
export class LoginPageModule {}