import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';
import { Ng2SmartTableModule } from 'ng2-smart-table'; //ng2-smart-table
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask

import { Fix_asset_group } from './components/fix_asset_group';
import { Fix_asset } from './components/fix_asset';

import { routing } from './fixAsset.routing';
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
    CurrencyMaskModule,
    AppsModule,
  ],
  declarations: [
    Fix_asset_group,
    Fix_asset
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class FixAssetModule { }
