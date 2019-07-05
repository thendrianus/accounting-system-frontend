import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { Employee } from './components/employee/employee.component';
import { Employeejob } from './components/employeejob/employeejob.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'employee',
    component: Employee,
    data: {
      title: 'Employee'
    }
  }, {
    path: 'employeejob',
    component: Employeejob,
    data: {
      title: 'Employee Job'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
