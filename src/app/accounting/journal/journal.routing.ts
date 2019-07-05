import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Generaljournal } from './components/generaljournal/generaljournal.component';
import { Generalledger } from './components/generalledger/generalledger.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'generaljournal', component: Generaljournal, data: { title: 'General Journal' } },
  {
    path: 'generalledger',
    component: Generalledger,
    data: {
      title: 'General ledger'
    },
    children: [
      { path: 'generaljournal/:id', component: Generaljournal, data: { title: 'General Journal' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { }



