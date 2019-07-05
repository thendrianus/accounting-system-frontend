import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { InlineEditorModule } from '@qontu/ngx-inline-editor'; //inline-editor
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { IsactiveFilterPipe } from './isactive.pipe'; //isactivefilter
import { routing } from './sale.routing';
import { Sale_quotation } from './components/sale_quotation';

import { Sale_do } from './components/sale_do';
import { Sale_delivery } from './components/sale_delivery';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    CurrencyMaskModule,
    MomentModule,
    NgSelectModule,
    InlineEditorModule,
    AppsModule,
  ],
  declarations: [
    Sale_quotation,
    IsactiveFilterPipe,
    Sale_do,
    Sale_delivery
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class SaleModule { }
