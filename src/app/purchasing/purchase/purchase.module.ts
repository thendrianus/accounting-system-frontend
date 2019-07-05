import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask
import { InlineEditorModule } from '@qontu/ngx-inline-editor'; //inline-editor

import { IsactiveFilterPipe } from './isactive.pipe'; //isactivefilter
import { routing } from './purchase.routing';

import { Purchase_quotation } from './components/purchase_quotation';
import { Purchase_request } from './components/purchase_request';
import { Purchase_receive } from './components/purchase_receive';

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
    Purchase_quotation,
    IsactiveFilterPipe,
    Purchase_request,
    Purchase_receive
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class PurchaseModule { }
