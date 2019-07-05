import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';

import { Conversion_cost } from './components/conversion_cost/conversion_cost.component';
import { Standard_cost } from './components/standard_cost/standard_cost.component';
import { Standard_inventory } from './components/standard_inventory/standard_inventory.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'conversioncost', component: Conversion_cost, data: { title: 'Conversion Cost' } },
  { path: 'standardcost', component: Standard_cost, data: { title: 'Standard Cost' } },
  { path: 'standardinventory', component: Standard_inventory, data: { title: 'Standard Inventory' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
