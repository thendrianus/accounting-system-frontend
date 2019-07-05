import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppsModule } from '../../apps/apps.module';

import { Account } from './components/account/account.component';
import { Accountlink } from './components/accountlink/accountlink.component';
import { Period } from './components/period/period.component';
import { IsactiveFilterPipe } from './isactive.pipe'; //isactivefilter
import { routing } from './account.routing';
import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AppsModule,
    NgSelectModule
  ],
  declarations: [
    Account,
    Accountlink,
    Period,
    IsactiveFilterPipe
  ],
  exports: [

  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class AccountModule { }
