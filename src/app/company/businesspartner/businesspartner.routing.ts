import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { Businesspartner } from './components/businesspartner/businesspartner.component';
import { Businesspartner_group } from './components/businesspartner_group';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'businesspartner',
    component: Businesspartner,
    data: {
      title: 'Businesspartner'
    }
  },
  {
    path: 'businesspartnergroup',
    component: Businesspartner_group,
    data: {
      title: 'Businesspartner Group'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
