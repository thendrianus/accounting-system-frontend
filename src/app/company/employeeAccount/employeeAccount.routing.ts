import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Employee_account } from './components/employee_account/employee_account.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Employee_account,
    data: {
      title: 'Dashboard'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { } 