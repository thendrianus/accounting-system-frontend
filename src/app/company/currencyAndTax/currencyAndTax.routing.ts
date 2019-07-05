import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { Tax } from './components/tax';
import { Currency } from './components/currency';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'tax',
    component: Tax,
    data: {
      title: 'Tax'
    }
  }, {
    path: 'currency',
    component: Currency,
    data: {
      title: 'Currency'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
