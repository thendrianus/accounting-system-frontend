import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppsModule } from '../../apps/apps.module';

import { NgSelectModule } from '@ng-select/ng-select'; //ng-select

import { routing } from './currencyAndTax.routing';

import { Tax } from './components/tax/tax.component';
import { Currency } from './components/currency';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    NgSelectModule,
    AppsModule,
  ],
  declarations: [
    Tax,
    Currency,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  providers: [
  ],
})
export class CurrencyAndTaxModule { }
