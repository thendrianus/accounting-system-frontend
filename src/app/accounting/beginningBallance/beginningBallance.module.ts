import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';

import { MomentModule } from 'angular2-moment';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { Bbaccount } from './components/bbaccount';
import { Bbcash } from './components/bbcash';
import { Bbrp } from './components/bbrp';

import { routing } from './beginningBallance.routing';
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    NgSelectModule,
    CurrencyMaskModule,
    AppsModule,
    MomentModule
  ],
  declarations: [
    Bbaccount,
    Bbcash,
    Bbrp,
  ],
  exports: [

  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class BeginningBallanceModule { }
