import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { routing } from './manufactureData.routing';

import { Conversion_cost } from './components/conversion_cost/conversion_cost.component';
import { Standard_cost } from './components/standard_cost/standard_cost.component';
import { Standard_inventory } from './components/standard_inventory/standard_inventory.component';

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
    NgSelectModule,
    CurrencyMaskModule,
    AppsModule,
  ],
  declarations: [
    Conversion_cost,
    Standard_cost,
    Standard_inventory,
  ],
  exports: [

  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class ManufactureDataModule { }
