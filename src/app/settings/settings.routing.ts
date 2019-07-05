import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Settings } from './settings.component';
import { Component_gen } from './components/component_gen/component_gen.component';
import { Permission } from './components/permission/permission.component';

const routes: Routes = [
  {
    path: '',
    component: Settings,
    data: {
      title: 'Settings'
    },
    children: [
      { path: 'componentgenerate', component: Component_gen, data: { title: 'Component Generate' } },
      { path: 'permission', component: Permission, data: { title: 'Permission' } },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { }



