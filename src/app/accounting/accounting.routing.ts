import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Accounting } from './accounting.component';
import { Cashin } from './components/cashin';
import { Cashout } from './components/cashout';
import { Cash_transfer } from './components/cash_transfer';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Accounting,
    data: {
      title: 'Accounting'
    },
    children: [
      { path: 'cashin', component: Cashin, data: { title: 'Cash In' } },
      { path: 'cashout', component: Cashout, data: { title: 'Cash Out' } },
      { path: 'cashtransfer', component: Cash_transfer, data: { title: 'Cash Transfer' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { }



