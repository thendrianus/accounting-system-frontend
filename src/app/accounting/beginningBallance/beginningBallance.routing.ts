import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Bbaccount } from './components/bbaccount';
import { Bbcash } from './components/bbcash';
import { Bbrp } from './components/bbrp';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'bbaccount',
    component: Bbaccount,
    data: {
      title: 'Beginning Ballance Account'
    }
  },
  {
    path: 'bbcash',
    component: Bbcash,
    data: {
      title: 'Beginning Ballance Cash'
    }
  },
  {
    path: 'bbpayable',
    component: Bbrp,
    data: {
      title: 'Beginning Ballance Payable'
    }
  },
  {
    path: 'bbreceivable',
    component: Bbrp,
    data: {
      title: 'Beginning Ballance Receivable'
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { }



