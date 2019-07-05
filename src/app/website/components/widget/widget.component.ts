import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'widget',
  templateUrl: './widget.html',
})
export class Widget {

  @ViewChild('childModal') public childModal: ModalDirective;

  public defaultWidgetDetails = [];

  public widgetDetails: any = this.copying(this.defaultWidgetDetails);
  public widgetDetailCategory: any = [];

  formWidget: any;
  formWidgetDetail: any;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };


  _formWidget = { widget_id: '', widget_code: '', name: '', file_name: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  _formWidgetDetail = { widget_detail_id: '', widget_detail_category_id: '', widget_detail_default: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formWidget = this.formBuilder.group({ //sssss
      widget_id: '',
      widget_code: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      file_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.formWidgetDetail = this.formBuilder.group({ //sssss
      widget_detail_id: '',
      widget_id: '',
      widget_detail_category_id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      widget_detail_default: [''],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formWidget');
    console.log(this.formWidget);
    console.log('this.formWidgetDetail');
    console.log(this.formWidgetDetail);
  }

  gen: any = { "app_component_id": 0, "_title": "Widget", "_code": "Code", "_titleM1": "Title Modal", "ph_name": "Name", "ph_description": "Description", "ph_filename": "File Name", "ph_default": "Default", "ph_description2": "Description", "at_name": "Name", "at_description": "Description", "at_file": "File", "at_category": "Category", "at_default": "Default", "at_description2": "Description", "btn_add": " Add", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_add2": "Add", "btn_edit2": "Edit", "btn_cancel2": "Cancel", "btn_delete2": "Delete", "btn_closeM1": "Close", "btn_edit": "Edit", "th_action": "Action", "th_no": "No", "th_category": "Category", "th_default_value": "Default Value", "th_description": "Description", "th_action2": "Action", "th_no2": "No", "th_name2": "Name", "th_description2": "Description", "th_filename2": "File Name", "td_select": "Select", "td_select2": "Select" };

  ngOnInit() {

    window.scrollTo(0, 0);
    if (this.httpService.is_authorization) {
      this.getGen();
    } else {
      this.httpService.authorization(true).then(value => {
        this.getGen();
      });
    }

  }


  getGen() {
    this.httpService.getTranslate('47').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;

          this.getWidgetDetailCategory();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  getWidgetDetailCategory() {
    this.widgetDetailCategory = JSON.parse("[]");
    this.httpService.http_api_get('website/widget/category/').subscribe((value) => {
      if (value.success) {
        this.widgetDetailCategory = value.data.category;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getwidgetdetails(selectedWidget) {
    
    this.httpService.http_api_post('website/widget/details', selectedWidget)
      .subscribe((value) => {
        if (value.success) { 
          this.widgetDetails = value.data.widget;
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  submitFormWidgetDetail() {

    if (this.formWidget.value.widget_id == '') {
      this.notif.error = { title: 'Error', content: 'You havent save your data', setting: this.httpService.error, change: Math.random().toString() };
    } else if (this.formWidget.valid) {

      this.formWidgetDetail.patchValue({
        widget_id: this.formWidget.value.widget_id,
        update_by: this.httpService.currentUser.employee_id,
        update_datetime: new Date(),
      })

      if (this.formWidgetDetail.value.widget_detail_id == '') {

        this.formWidgetDetail.patchValue({
          create_by: this.httpService.currentUser.employee_id,
          create_datetime: new Date(),
        })

        console.log(this.formWidgetDetail.getRawValue())
        this.httpService.http_api_post('website/widget/detail', this.formWidgetDetail.getRawValue())
          .subscribe((value) => {

            if (value.success) {

              this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
              this.formWidgetDetail.reset(this._formWidgetDetail);
              this.getwidgetdetails(this.formWidget.getRawValue());

            } else {
              this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
            }

          },
            error => {
              this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
            });

      } else {
        this.updateWidgetDetail();
      }

    } else {
      this.notif.error = { title: 'Error', content: 'Please check your data', setting: this.httpService.error, change: Math.random().toString() };
    }
  }

  updateWidgetDetail() {

    this.httpService.http_api_put('website/widget/detail', this.formWidgetDetail.getRawValue())
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.formWidgetDetail.reset(this._formWidgetDetail);
          this.getwidgetdetails(this.formWidget.getRawValue());
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  widgetParse: any = {};
  submitFormWidget() {

    this.widgetParse = this.copying(this.formWidget.getRawValue());

    this.widgetParse.update_by = this.httpService.currentUser.employee_id;
    this.widgetParse.update_datetime = new Date();

    if (this.widgetParse.widget_id == '') {

      this.widgetParse.create_by = this.httpService.currentUser.employee_id;
      this.widgetParse.create_datetime = new Date();

      this.httpService.http_api_post('website/widget', this.widgetParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.widgetParse.widget_id = value.data.lastId;
            this.widgetParse.widget_code = value.data.widget_code;
            this.formWidget.patchValue(this.copying(this.widgetParse));
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateWidget();
    }
  }

  deleteWidget() {
    if (confirm("Are you sure to delete this data?")) {
      this.formWidget.patchValue({ is_active: 0 });
      this.submitFormWidget();
    }
  }

  updateWidget() {
    this.httpService.http_api_put('website/widget', this.widgetParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.widgetParse.is_active == 0) {
            this.clearAll();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  editWidgetDetail(item) {
    this.formWidgetDetail.patchValue(this.copying(item));
  }

  cancelWidgetDetail() {
    this.formWidgetDetail.reset(this._formWidgetDetail);
  }

  deleteWidgetDetail() {
    if (confirm("Are you sure to delete this data?")) {
      this.formWidgetDetail.patchValue({ is_active: 0 });
      this.submitFormWidgetDetail();
    }
  }

  clearAll() {
    this.formWidget.reset(this._formWidget);
    this.formWidgetDetail.reset(this._formWidgetDetail);
    this.widgetDetails = this.copying(this.defaultWidgetDetails);
  }


  modalShow() {

    this.ModalHeader = 'List Widget';
    this.ModalGetwidget();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.formWidget.patchValue(this.ModalSelectedWidget);
    this.getwidgetdetails(this.ModalSelectedWidget);
    this.modalHide();
  }

  public ModalWidget: any = [];
  public ModalHeader: string;
  public ModalSelectedWidget: string = '';

  ModalGetwidget() {
    this.ModalWidget = JSON.parse("[]");
    this.httpService.http_api_get('website/widget/search/').subscribe((value) => {
      if (value.success) {
        this.ModalWidget = value.data.widget;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectWidget(item) {
    this.ModalSelectedWidget = item;
    this.modalOut();
    this.modalHide();
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
