import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';
import { MomentModule } from 'angular2-moment';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table

import { Generalledger } from './components/generalledger';
import { Generaljournal } from './components/generaljournal';

import { routing } from './journal.routing';
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

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
    Generaljournal,
    Generalledger,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class JournalModule { }
