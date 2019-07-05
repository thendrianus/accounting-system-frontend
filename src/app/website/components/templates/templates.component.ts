import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'templates',
  templateUrl: './templates.html',
})
export class Templates {

  @ViewChild('childModal') public childModal: ModalDirective;

  public defaultTemplateDetails = [];

  public templateDetails: any = this.copying(this.defaultTemplateDetails);
  public templateCategory: any = [];
  public widgetList: any = [];

  formTemplate: any;
  formTemplateDetail: any;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };


  _formTemplate = { category: '', template_id: '', template_code: '', name: '', template_category_id: '', description: '-', filename: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, }

  _formTemplateDetail = { template_detail_id: '', name: '', widget_id: '', description: '-', positions: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formTemplate = this.formBuilder.group({ //sssss
      category: [''],
      template_id: '',
      template_code: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      template_category_id: '',
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      filename: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
    });

    this.formTemplateDetail = this.formBuilder.group({ //sssss
      template_detail_id: '',
      template_id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      widget_id: [''],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      positions: [''],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formTemplate');
    console.log(this.formTemplate);
    console.log('this.formTemplateDetail');
    console.log(this.formTemplateDetail);
  }

  gen: any = { "app_component_id": 0, "_title": "Template", "_code": "Code", "_titleM1": "Title Modal", "ph_name": "Name", "ph_description": "Description", "ph_filename": "File Name", "ph_name2": "Name", "ph_description2": "Description", "ph_position": "Position", "at_name": "Name", "at_category": "Category", "at_description": "Description", "at_filename": "File Name", "at_widget": "Widget", "at_position": "Position", "at_name2": "Name", "at_description2": "Description", "btn_add": " Add", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_add2": "Add", "btn_edit2": "Edit", "btn_cancel2": "Cancel", "btn_delete2": "Delete", "btn_edit": "Edit", "btn_closeM1": "Close", "th_action": "Action", "th_position": "Position", "th_name": "Name", "th_widget": "Widget", "th_description": "Description", "th_action2": "Action", "th_no2": "No", "th_description2": "Description", "th_filename2": "File Name", "td_select": "Select", "td_select2": "Select" };

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
    this.httpService.getTranslate('46').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;

          this.getTemplateCategory();
          this.getWidgetList();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  getTemplateCategory() {
    this.templateCategory = JSON.parse("[]");
    this.httpService.http_api_get('website/template/category/').subscribe((value) => {
      if (value.success) {
        this.templateCategory = value.data.category;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getWidgetList() {
    this.widgetList = JSON.parse("[]");
    this.httpService.http_api_get('website/widget/list/').subscribe((value) => {
      if (value.success) {
        this.widgetList = value.data.widget;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  gettemplatedetails(selectedTemplate) {
    this.httpService.http_api_post('website/template/details', selectedTemplate)
      .subscribe((value) => {
        if (value.success) {
          this.templateDetails = value.data.template;
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  submitFormTemplateDetail() {

    if (this.formTemplate.value.template_id == '') {
      this.notif.error = { title: 'Error', content: 'You havent save your data', setting: this.httpService.error, change: Math.random().toString() };
    } else if (this.formTemplate.valid) {

      this.formTemplateDetail.patchValue({
        template_id: this.formTemplate.value.template_id,

        update_by: this.httpService.currentUser.employee_id,
        update_datetime: new Date(),
      })

      if (this.formTemplateDetail.value.template_detail_id == '') {

        this.formTemplateDetail.patchValue({
          create_by: this.httpService.currentUser.employee_id,
          create_datetime: new Date(),
        })

        this.httpService.http_api_post('website/template/detail', this.formTemplateDetail.getRawValue())
          .subscribe((value) => {

            if (value.success) {
              this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
              this.formTemplateDetail.reset(this._formTemplateDetail);
              this.gettemplatedetails(this.formTemplate.getRawValue());
            } else {
              this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
            }

          },
            error => {
              this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
            });

      } else {
        this.updateTemplateDetail();
      }
    } else {
      this.notif.error = { title: 'Error', content: 'Please check your data', setting: this.httpService.error, change: Math.random().toString() };
    }
  }

  updateTemplateDetail() {
    this.httpService.http_api_put('website/template/detail', this.formTemplateDetail.getRawValue())
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.formTemplateDetail.reset(this._formTemplateDetail);
          this.gettemplatedetails(this.formTemplate.getRawValue());
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  deleteTemplateDetail() {
    if (confirm("Are you sure to delete this data?")) {
      this.formTemplateDetail.patchValue({ is_active: 0 });
      this.submitFormTemplateDetail();
    }
  }

  templateParse: any = {};
  submitFormTemplate() {

    this.templateParse = this.copying(this.formTemplate.getRawValue());

    this.templateParse.update_by = this.httpService.currentUser.employee_id;
    this.templateParse.update_datetime = new Date();

    if (this.formTemplate.value.template_id == '') {

      this.templateParse.create_by = this.httpService.currentUser.employee_id;
      this.templateParse.create_datetime = new Date();

      this.httpService.http_api_post('website/template', this.templateParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };

            this.templateParse.template_id = value.data.lastId;
            this.templateParse.template_code = value.data.template_code;
            this.formTemplate.patchValue(this.copying(this.templateParse));

            this.gettemplatedetails(this.formTemplate.getRawValue());

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateTemplate();
    }
  }

  deleteTemplate() {
    if (confirm("Are you sure to delete this data?")) {
      this.formTemplate.patchValue({ is_active: 0 });
      this.submitFormTemplate();
    }
  }

  updateTemplate() {
    this.httpService.http_api_put('website/template', this.formTemplate.getRawValue())
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formTemplate.value.is_active == 0) {
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

  editTemplateDetail(item) {
    this.formTemplateDetail.patchValue(this.copying(item));
  }

  cancelTemplateDetail() {
    this.formTemplateDetail.reset(this._formTemplateDetail);
  }

  clearAll() {
    this.formTemplate.reset(this._formTemplate)
    this.formTemplateDetail.reset(this._formTemplateDetail);
    this.templateDetails = this.copying(this.defaultTemplateDetails);
  }


  modalShow() {
    this.ModalHeader = 'List Template';
    this.ModalGettemplate();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.formTemplate.patchValue(this.ModalSelectedTemplate);
    this.gettemplatedetails(this.ModalSelectedTemplate);
    this.modalHide();
  }

  public ModalTemplate: any = [];
  public ModalHeader: string;
  public ModalSelectedTemplate: string = '';

  ModalGettemplate() {
    this.ModalTemplate = JSON.parse("[]");
    this.httpService.http_api_get('website/template/search/').subscribe((value) => {
      if (value.success) {
        this.ModalTemplate = value.data.template;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectTemplate(item) {
    this.ModalSelectedTemplate = item;
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
