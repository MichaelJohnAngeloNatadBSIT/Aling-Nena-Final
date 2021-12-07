import {NgModule} from '@angular/core';

import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';

import { FileSizePipe } from './file-size.pipe';

@NgModule({
  declarations:[ShowHidePasswordComponent, FileSizePipe],
  exports:[ShowHidePasswordComponent, FileSizePipe]
})
export class ComponentModule
{
}