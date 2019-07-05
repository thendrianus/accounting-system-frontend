import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppsModule } from '../../apps/apps.module';

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select

import { routing } from './employeeAccount.routing';

import { Employee_account } from './components/employee_account/employee_account.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    NgSelectModule,
    AppsModule,
  ],
  declarations: [
    Employee_account,
  ]
})
export class EmployeeAccountModule { }
