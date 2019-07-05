import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Reconciliation_bank } from './components/reconciliation_bank';
import { Reconciliation_adj } from './components/reconciliation_adj';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'reconciliationbank', component: Reconciliation_bank, data: { title: 'Reconciliation Bank' } },
  { path: 'reconciliationadj', component: Reconciliation_adj, data: { title: 'Reconciliation Adjustment' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { }



