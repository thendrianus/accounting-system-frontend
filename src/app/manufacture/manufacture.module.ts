import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { Manufacture } from './manufacture.component';
import { routing } from './manufacture.routing';

import { Bom } from './components/bom/bom.component';
import { Work_order } from './components/work_order/work_order.component';
import { Material_release } from './components/material_release/material_release.component';
import { Product_result } from './components/product_result/product_result.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    MomentModule,
    NgSelectModule,
    CurrencyMaskModule,
    AppsModule,
  ],
  declarations: [
    Manufacture,
    Bom,
    Work_order,
    Material_release,
    Product_result
  ],
  exports: [

  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class ManufactureModule { }
