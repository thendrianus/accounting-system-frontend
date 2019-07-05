import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { routing } from './employee.routing';

import { Employeejob } from './components/employeejob/employeejob.component';

import { Employee } from './components/employee/employee.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    MomentModule,
    AppsModule,
  ],
  declarations: [
    Employee,
    Employee,
    Employeejob,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class EmployeeModule { }
