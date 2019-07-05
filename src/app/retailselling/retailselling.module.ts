import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { TimepickerModule } from 'ngx-bootstrap/timepicker'; //timepicker

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { Retailselling } from './retailselling.component';
import { IsactiveFilterPipe } from './isactive.pipe'; //isactivefilter
import { routing } from './retailselling.routing';

import { Pos } from './components/pos';
import { Pos_stand } from './components/pos_stand';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    MomentModule,
    TimepickerModule.forRoot(),
    NgSelectModule,
    // BsDropdownModule,
    AppsModule,
  ],
  declarations: [
    Retailselling,
    Pos,
    Pos_stand,
    IsactiveFilterPipe,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class RetailsellingModule { }
