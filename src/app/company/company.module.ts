import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';
import { AppsModule } from '../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select

import { Company } from './components/company';
import { Companyoutlet } from './companyoutlet.component';
import { routing } from './company.routing';

import { Warehouse } from './components/warehouse';
import { Branch } from './components/branch';
import { Uom } from './components/uom';
import { Department } from './components/department';

import { Project } from './components/project/project.component';
import { Report_template } from './components/report_template/report_template.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    MomentModule,
    NgSelectModule,
    AppsModule,
  ],
  declarations: [
    Companyoutlet,
    Company,
    Warehouse,
    Branch,
    Uom,
    Department,
    Project,
    Report_template
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class CompanyModule { }
