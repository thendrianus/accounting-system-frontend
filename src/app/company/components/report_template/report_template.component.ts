import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'report_template',
  styleUrls: ['./report_template.scss'],
  templateUrl: './report_template.html',
})
export class Report_template {

  @ViewChild('childModal') public childModal: ModalDirective;

  formReport_template;
  currentUser: any = { employee_job_id: 0 };
  public report_templateParse: any = {};

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formReport_template = { report_template_id: '', report_template_code: '', report_id: '1', name: '', report_template: '', description: '-', is_use: 1, is_active: 1, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), label: '' }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formReport_template = this.formBuilder.group({ //sssss
      report_template_id: '',
      report_template_code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      report_id: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      report_template: ['', [Validators.required, Validators.minLength(1)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      is_use: 1,
      is_active: 1,
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      label: ''
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formReport_template');
    console.log(this.formReport_template);
  }

  gen: any = { "app_component_id": 0 };

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
    this.httpService.getTranslate('68').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.report_template_code = true;
          this.getReport();
        } else {
          this.httpService.goToDashboard();
        }

      }
    )
  }

  report: any = [];

  getReport() {
    this.httpService.http_api_get('apps/report_template/report/')
      .subscribe((value) => {
        if (value.success) {
          this.report = value.data.report;
          if (this.report.length > 0) {
            this.formReport_template.patchValue({ report_id: this.report[0].value });
            this._formReport_template.report_id = this.report[0].value;
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};

        });
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  formSubmit() {

    this.report_templateParse = this.copying(this.formReport_template.getRawValue());
    this.report_templateParse.create_by = this.httpService.currentUser.employee_id;
    this.report_templateParse.update_by = this.httpService.currentUser.employee_id;
    this.report_templateParse.update_datetime = new Date();
    this.report_templateParse.create_datetime = new Date();

    if (this.report_templateParse.report_template_id == '') {
      this.httpService.http_api_post('apps/report_template/s', this.report_templateParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setreport_template(this.report_templateParse);
            this.formReport_template.patchValue({
              report_template_id: value.data.lastId,
              report_template_code: value.data.report_template_code
            })
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateReport_template();
    }
  }

  updateReport_template() {

    this.report_templateParse = this.copying(this.formReport_template.getRawValue());
    this.report_templateParse.update_by = this.httpService.currentUser.employee_id;
    this.report_templateParse.update_datetime = new Date();

    this.httpService.http_api_put('apps/report_template/s', this.report_templateParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formReport_template.value.is_active == 0) {
            this.clearAll();
          } else {
            this.setreport_template(this.report_templateParse);
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  deleteReport_template() {

    if (confirm(this.gen._delete_warning + this.formReport_template.value.label)) {
      this.formReport_template.patchValue({ is_active: 0 });
      this.updateReport_template();
    }

  }

  clearAll() {
    this.setreport_template(false);
  }

  setreport_template(data) {
    if (data) {
      data.report_id = "" + data.report_id + "";
      this.formReport_template.patchValue({ ...this.copying(data) });
    } else {
      this.formReport_template.reset(this._formReport_template)
    }

  }


  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      this.formReport_template.patchValue({ picture: JSON.parse(data.response)[0].filename });
    }

  }

  modalShow() {
    this.ModalHeader = 'List Report_template';
    this.ModalGetReport_template();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setreport_template(this.ModalSelectedReport_template);
  }

  public ModalReport_template: any = [];
  public ModalHeader: string;
  public ModalSelectedReport_template: any = [];

  gens = { td_refresh: 'Refresh' }
  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        add: true,
        edit: false,
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.td_select}`,
        confirmDelete: true,
      },
      add: {
        addButtonContent: `${this.gens.td_refresh}`,
        confirmSave: true,
      },
      columns: this.httpService.generateng2columns({
        report_template_code: {
          title: this.gen.tn_code,
          type: 'string',
          width: '10%',
          show: 1
        },
        name: {
          title: this.gen.tn_name,
          type: 'string',
          width: '20%',
          show: 1
        },
        report: {
          title: this.gen.tn_report,
          type: 'string',
          width: '20%',
          show: 1
        },
        description: {
          title: this.gen.tn_description,
          type: 'string',
          width: '50%',
          show: 1
        },
      }),
      pager: {
        perPage: 75
      }
    }
  }

  source: LocalDataSource = new LocalDataSource();

  ModalGetReport_template() {
    this.ModalReport_template = JSON.parse("[]");
    this.httpService.http_api_post('apps/report_template', { report_id: this.formReport_template.value.report_id }).subscribe((value) => {
      if (value.success) {
        this.ModalReport_template = value.data.report_template;
        this.source.load(this.ModalReport_template);
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  refresh_search() {
    this.ModalGetReport_template();
  }

  ModalSelectReport_template(item) {
    this.ModalSelectedReport_template = item.data;

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
