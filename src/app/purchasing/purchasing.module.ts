import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask
import { InlineEditorModule } from '@qontu/ngx-inline-editor'; //inline-editor

import { Purchasing } from './purchasing.component';
import { IsactiveFilterPipe } from './isactive.pipe'; //isactivefilter
import { routing } from './purchasing.routing';

import { Purchase } from './components/purchase';
import { Purchase_order } from './components/purchase_order';
import { Purchase_return } from './components/purchase_return/purchase_return.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    CurrencyMaskModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    MomentModule,
    NgSelectModule,
    InlineEditorModule,
    AppsModule,
  ],
  declarations: [
    Purchasing,
    Purchase,
    Purchase_order,
    IsactiveFilterPipe,
    Purchase_return,
  ],
  exports: [
    Purchase
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class PurchasingModule { }
