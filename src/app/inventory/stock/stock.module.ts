import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';

import { MomentModule } from 'angular2-moment';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select

import { Inventory_in } from './components/inventory_in/inventory_in.component';
import { Inventory_out } from './components/inventory_out/inventory_out.component';
import { Inventory_stock_adjustment } from './components/inventory_stock_adjustment/inventory_stock_adjustment.component';
import { Inventorybb } from './components/inventorybb/inventorybb.component';
import { Inventory_transfer } from './components/inventory_transfer/inventory_transfer.component';
import { routing } from './stock.routing';

import { Inventorystockchange } from './components/inventorystockchange/inventorystockchange.component';

// import { AccountingModule } from '../../accounting/accounting.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    MomentModule,
    Ng2SmartTableModule,
    // AccountingModule,
    NgSelectModule,
    AppsModule,
  ],
  declarations: [
    Inventorystockchange,
    Inventory_in,
    Inventory_out,
    Inventory_stock_adjustment,
    Inventorybb,
    Inventory_transfer
  ],
  exports: [
    Inventorystockchange,
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class StockModule { }
