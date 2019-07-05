import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';

import { MomentModule } from 'angular2-moment';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { Reconciliation_bank } from './components/reconciliation_bank';
import { Reconciliation_adj } from './components/reconciliation_adj';

import { routing } from './reconciliation.routing';
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    MomentModule,
    NgSelectModule,
    CurrencyMaskModule,
    AppsModule,
  ],
  declarations: [
    Reconciliation_bank,
    Reconciliation_adj,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ReconciliationModule { }
