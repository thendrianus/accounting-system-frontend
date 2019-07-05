import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../apps/apps.module';

import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select 
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { Inventory } from './inventory.component';
import { routing } from './inventory.routing';

// import { AccountingModule } from '../accounting/accounting.module';

import { Brand } from './components/brand/brand.component';
import { Inventory_group } from './components/inventory_group/inventory_group.component';
import { Inventoryasset } from './components/inventoryasset/inventoryasset.component';
import { Inventorydetailcategory } from './components/inventorydetailcategory/inventorydetailcategory.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    Ng2SmartTableModule,
    CurrencyMaskModule,
    // AccountingModule,
    NgSelectModule,
    AppsModule,
  ],
  declarations: [
    Inventory,
    Brand,
    Inventory_group,
    Inventoryasset,
    Inventorydetailcategory,
  ],
  exports: [
    Inventoryasset,
    Inventorydetailcategory,
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class InventoryModule { }
