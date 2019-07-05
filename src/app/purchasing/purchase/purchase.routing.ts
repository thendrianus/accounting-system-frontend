import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { Purchase_quotation } from './components/purchase_quotation';
import { Purchase_request } from './components/purchase_request';
import { Purchase_receive } from './components/purchase_receive';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'purchasequotation', component: Purchase_quotation, data: { title: 'Purchase Quotation' } },
  { path: 'purchaserequest', component: Purchase_request, data: { title: 'Purchase Request' } },
  { path: 'purchasereceive', component: Purchase_receive, data: { title: 'Purchase Receive' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
