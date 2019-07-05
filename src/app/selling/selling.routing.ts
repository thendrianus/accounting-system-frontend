import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Selling } from './selling.component';
import { ModuleWithProviders } from '@angular/core';
import { Sale } from './components/sale';
import { Sale_order } from './components/sale_order';
import { Sale_return } from './components/sale_return/sale_return.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Selling,
    data: {
      title: 'Accounting'
    },
    children: [
      { path: 'sale', component: Sale, data: { title: 'Sale' } },
      { path: 'saleorder', component: Sale_order, data: { title: 'Sale Order' } },
      { path: 'salereturn', component: Sale_return, data: { title: 'Sale Return' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
