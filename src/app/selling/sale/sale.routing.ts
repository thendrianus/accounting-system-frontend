import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { Sale_quotation } from './components/sale_quotation';
import { Sale_do } from './components/sale_do';
import { Sale_delivery } from './components/sale_delivery';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'salequotation', component: Sale_quotation, data: { title: 'Sale Quotation' } },
  { path: 'saledo', component: Sale_do, data: { title: 'Sale Delivery Order' } },
  { path: 'saledelivery', component: Sale_delivery, data: { title: 'Sale Delivery' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
