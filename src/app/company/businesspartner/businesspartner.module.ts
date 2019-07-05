import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset

import { routing } from './businesspartner.routing';

import { Businesspartner_group } from './components/businesspartner_group';

import { Address } from './components/businesspartner/components/address/address.component';
import { Contact } from './components/businesspartner/components/contact/contact.component';
import { Businesspartner } from './components/businesspartner/businesspartner.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    Ng2SmartTableModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AppsModule,
  ],
  declarations: [
    Businesspartner,
    Businesspartner,
    Address,
    Contact,
    Businesspartner_group
  ],
  exports: [
    Address,
    Contact,
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class BusinesspartnerModule { }
