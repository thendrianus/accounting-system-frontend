import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { routing } from './layouts.routing';

import { LayoutsComponent } from './layouts.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset
import { NAV_DROPDOWN_DIRECTIVES } from './../shared/nav-dropdown.directive';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './../shared/sidebar.directive';
import { AsideToggleDirective } from './../shared/aside.directive';
import { BreadcrumbsComponent } from './../shared/breadcrumb.component';
import { ReplaceDirective } from './../shared/replace.directive';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmptyLayoutComponent } from './empty-layout.component';
import { FullLayoutComponent } from './full-layout.component';

import { AppsModule } from './../apps/apps.module';
import { HttpService, QzTrayService } from './../';

const COMPONENTS = [
  EmptyLayoutComponent,
  LayoutsComponent,
  FullLayoutComponent,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  BreadcrumbsComponent,
  SIDEBAR_TOGGLE_DIRECTIVES,
  AsideToggleDirective,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    routing,
    // BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    AppsModule.forRoot(),
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ], entryComponents: [
  ],
  bootstrap: [LayoutsComponent],
  providers: [
    HttpService,
    QzTrayService
  ],

})
export class LayoutsModule { }
