import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Inventory } from './inventory.component';
import { ModuleWithProviders } from '@angular/core';

import { Brand } from './components/brand/brand.component';
import { Inventory_group } from './components/inventory_group/inventory_group.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'inventorydata',
    component: Inventory,
    data: {
      title: 'Inventory'
    }
  },
  {
    path: 'brand',
    component: Brand,
    data: { title: 'Brand' }
  },
  {
    path: 'itemgroup',
    component: Inventory_group,
    data: { title: 'Item Group' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
