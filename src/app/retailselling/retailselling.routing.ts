import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Retailselling } from './retailselling.component';
import { ModuleWithProviders } from '@angular/core';
import { Pos } from './components/pos';
import { Pos_stand } from './components/pos_stand';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Retailselling,
    data: {
      title: 'Retail Selling'
    },
    children: [
      { path: 'pos', component: Pos, data: { title: 'Point Of Sales' } },
      { path: 'posstand', component: Pos_stand, data: { title: 'POS Stand' } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
