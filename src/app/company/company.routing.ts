import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Company } from './components/company';
import { Companyoutlet } from './companyoutlet.component';
import { ModuleWithProviders } from '@angular/core';
import { Warehouse } from './components/warehouse';
import { Branch } from './components/branch';
import { Uom } from './components/uom';
import { Department } from './components/department';
import { Project } from './components/project/project.component';
import { Report_template } from './components/report_template/report_template.component';
// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Companyoutlet,
    data: {
      title: 'Company'
    },
    children: [
      { path: 'action/:id', component: Company, data: { title: '' } },
      { path: 'warehouse', component: Warehouse, data: { title: 'Warehouse' } },
      { path: 'branch', component: Branch, data: { title: 'Branch' } },
      { path: 'uom', component: Uom, data: { title: 'Unit Of Measurement' } },
      { path: 'project', component: Project, data: { title: 'Project' } },
      { path: 'department', component: Department, data: { title: 'Department' } },
      { path: 'reporttemplate', component: Report_template, data: { title: 'Report Template' } },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
