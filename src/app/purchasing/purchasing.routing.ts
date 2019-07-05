import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Purchasing } from './purchasing.component';
import { ModuleWithProviders } from '@angular/core';
import { Purchase } from './components/purchase';
import { Purchase_order } from './components/purchase_order';
import { Purchase_return } from './components/purchase_return/purchase_return.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Purchasing,
    data: {
      title: 'Accounting'
    },
    children: [
      { path: 'purchase', component: Purchase, data: { title: 'Purchase' } },
      { path: 'purchaseorder', component: Purchase_order, data: { title: 'Purchase Order' } },
      { path: 'purchasereturn', component: Purchase_return, data: { title: 'Purchase Return' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
