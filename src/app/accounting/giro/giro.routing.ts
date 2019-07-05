import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Giroin } from './components/giroin';
import { Giroout } from './components/giroout';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'giroin', component: Giroin, data: { title: 'Giro In' } },
  { path: 'giroout', component: Giroout, data: { title: 'Giro Out' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { }



