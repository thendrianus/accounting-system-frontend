import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { MomentModule } from 'angular2-moment';

import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ModalModule.forRoot(),
    MomentModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    NgSelectModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule { }
