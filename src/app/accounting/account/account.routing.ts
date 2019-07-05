import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Account } from './components/account/account.component';
import { Accountlink } from './components/accountlink/accountlink.component';
import { Period } from './components/period/period.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'account',
    component: Account,
    data: {
      title: 'Account'
    }
  }, {
    path: 'accountlink',
    component: Accountlink,
    data: {
      title: 'Account Link'
    }
  }, {
    path: 'period',
    component: Period,
    data: {
      title: 'Period'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { } 