import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website.routing';
import { AppsModule } from '../apps/apps.module';

import { SellingModule } from '../selling/selling.module';
import { PurchasingModule } from '../purchasing/purchasing.module';
import { Navigation } from './components/navigation/navigation.component';
import { Articles } from './components/articles/articles.component';
import { DefaultModal } from './components/articles/default-modal/default-modal.component';

import { Website } from './website.component';

import { Templates } from './components/templates/templates.component';
import { Widget } from './components/widget/widget.component';
import { Pagination } from './components/pagination/pagination.component';

import { ModalModule } from 'ngx-bootstrap/modal'; //bsModal
import { TabsModule } from 'ngx-bootstrap/tabs'; //tabset

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';
import { TimepickerModule } from 'ngx-bootstrap/timepicker'; //timepicker
import { CKEditorModule } from 'ng2-ckeditor'; //ckeditor

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WebsiteRoutingModule,
    SellingModule,
    PurchasingModule,
    ModalModule.forRoot(),
    MomentModule,
    TimepickerModule.forRoot(),
    CKEditorModule,
    AppsModule,
  ],
  declarations: [
    Website,
    Navigation,
    Articles,
    DefaultModal,
    Templates,
    Widget,
    Pagination
  ]
})
export class WebsiteModule {
}
