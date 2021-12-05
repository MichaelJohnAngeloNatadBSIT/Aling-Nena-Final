import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSizePipe } from '../../file-size.pipe';

import { IonicModule } from '@ionic/angular';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';

import { ShowHidePasswordComponent } from 'src/app/show-hide-password/show-hide-password.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    ReactiveFormsModule
  ],
  entryComponents: [ShowHidePasswordComponent],
  declarations: [SignupPage, FileSizePipe, ShowHidePasswordComponent]
})
export class SignupPageModule {}
