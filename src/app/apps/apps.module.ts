import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { NgxUploaderModule } from 'ngx-uploader';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { NgSelectModule } from '@ng-select/ng-select'; //ng-select
import { CurrencyMaskModule } from "ng2-currency-mask"; //currencyMask
import { routing } from './apps.routing';
import { AppTranslationModule } from '../app.translation.module';
// import { Login } from './login/login.component';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal

import {
  TsPictureUploader,
  tsNotification,
  // tsModal,
  TsLanguage,
  TsByDatetime,
  Gllist,
  Glaction,
  Currency,
  Employeeselect
} from './components';

const COMPONENTS = [
  TsPictureUploader,
  tsNotification,
  // tsModal,
  TsLanguage,
  TsByDatetime,
  // Login,
  Gllist,
  Glaction,
  Currency,
  Employeeselect
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    // NgxUploaderModule,
    // ModalModule.forRoot(),
    routing,
    SimpleNotificationsModule.forRoot(),
    AppTranslationModule,
    ChartsModule,
    BsDropdownModule.forRoot(),
    NgSelectModule,
    CurrencyMaskModule
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ], entryComponents: [
  ],
  providers: [
    // SERVICES
  ],

})
export class AppsModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: AppsModule,
      providers: [
        // ...SERVICES
      ],
    };
  }
}
