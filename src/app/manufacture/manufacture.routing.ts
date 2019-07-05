import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Manufacture } from './manufacture.component';
import { ModuleWithProviders } from '@angular/core';

import { Bom } from './components/bom/bom.component';
import { Work_order } from './components/work_order/work_order.component';
import { Material_release } from './components/material_release/material_release.component';
import { Product_result } from './components/product_result/product_result.component';


// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Manufacture,
    data: {
      title: 'Accounting'
    },
    children: [
      { path: 'bom', component: Bom, data: { title: 'Bill Of Material' } },
      { path: 'workorder', component: Work_order, data: { title: 'Work Order' } },
      { path: 'materialrelease', component: Material_release, data: { title: 'Material Release' } },
      { path: 'productresult', component: Product_result, data: { title: 'Product Result' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
