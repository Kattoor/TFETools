import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';
import { SubheaderWrapperComponent } from './subheader-wrapper/subheader-wrapper.component';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownMenusModule } from '../../content/dropdown-menus/dropdown-menus.module';
import {SubheaderTfeComponent} from './subheader-tfe/subheader-tfe.component';

@NgModule({
  declarations: [
    SubheaderTfeComponent,
    SubheaderWrapperComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    InlineSVGModule,
    NgbDropdownModule,
    DropdownMenusModule,
  ],
  exports: [SubheaderWrapperComponent],
})
export class SubheaderModule { }
