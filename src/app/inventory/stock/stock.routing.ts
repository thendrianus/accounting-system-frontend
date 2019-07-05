import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';

import { Inventorystockchange } from './components/inventorystockchange/inventorystockchange.component';

import { Inventory_in } from './components/inventory_in/inventory_in.component';
import { Inventory_out } from './components/inventory_out/inventory_out.component';
import { Inventory_stock_adjustment } from './components/inventory_stock_adjustment/inventory_stock_adjustment.component';
import { Inventorybb } from './components/inventorybb/inventorybb.component';
import { Inventory_transfer } from './components/inventory_transfer/inventory_transfer.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'auditinventorystock',
    component: Inventorystockchange,
    data: { title: 'Stock Changes' }
  },
  {
    path: 'inventoryin',
    component: Inventory_in,
    data: { title: 'Inventory In' }
  },
  {
    path: 'inventoryout',
    component: Inventory_out,
    data: { title: 'Inventory Out' }
  },
  {
    path: 'stockadjustment',
    component: Inventory_stock_adjustment,
    data: { title: 'Stock Adjustment' }
  },
  {
    path: 'beginningbalanceinventory',
    component: Inventorybb,
    data: { title: 'Beginning Balance' }
  },
  {
    path: 'inventorytransfer',
    component: Inventory_transfer,
    data: { title: 'Inventory Transfer' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
