import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { Settings } from './settings.component';
import { Component_gen } from './components/component_gen/component_gen.component';
import { Permission } from './components/permission/permission.component';

import { routing } from './settings.routing';
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    NgSelectModule,
    AppsModule,
  ],
  declarations: [
    Settings,
    Component_gen,
    Permission
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class SettingsModule { }
