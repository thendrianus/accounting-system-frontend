import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { InlineEditorModule } from '@qontu/ngx-inline-editor'; //inline-editor
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { Selling } from './selling.component';
import { IsactiveFilterPipe } from './isactive.pipe'; //isactivefilter
import { routing } from './selling.routing';

import { Sale } from './components/sale';
import { Sale_order } from './components/sale_order';
import { Sale_return } from './components/sale_return/sale_return.component';

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
    Selling,
    Sale,
    Sale_order,
    IsactiveFilterPipe,
    Sale_return,
  ],
  exports: [
    Sale
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class SellingModule { }
