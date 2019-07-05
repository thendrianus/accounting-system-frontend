import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'giroout',
  templateUrl: './giroout.html',
})
export class Giroout {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel1 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formGiroout: any;

  currentUser: any = { employee_job_id: 0 };

  moneyOption = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: "."
  };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formGiroout = { giroout_id: '', general_journal_id: '', giroout_code: '', account_id: '', transaction_date: moment().format("YYYY-MM-DD"), efective_begin: moment().format("YYYY-MM-DD"), efective_end: moment().format("YYYY-MM-DD"), giro_no: '', nominal: 0, giro_from: '', giro_bank: '', project_id: '', description: '-', status_id: 1, old_status_id: 1, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formGiroout = this.formBuilder.group({
      giroout_id: '',
      general_journal_id: '',
      giroout_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      efective_begin: moment().format("YYYY-MM-DD"),
      efective_end: moment().format("YYYY-MM-DD"),
      giro_no: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      nominal: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      giro_from: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      giro_bank: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      project_id: ['', [Validators.minLength(0), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      status_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      old_status_id: 1,
      create_by: '-',
      update_by: '-',
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
    console.log('this.formGiroout');
    console.log(this.formGiroout);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Giroout", "_code": "General Giroout Code", "_titleModal1": "Title Modal", "ph_giroout_no": "Giroout Code", "ph_description": "Description", "ph_giro_from": "Giro From", "ph_giro_bank": "Giro Bank", "ph_giro_no": "Giro No", "ph_nominal": "Nominal", "ph_status": "Status", "ph_pending": "Pending", "ph_cleared": "Cleared", "ph_cancel": "Cancel", "ph_project": "Project", "at_giroout_Code": "Giroout Code", "at_date": "Date", "at_bank_account": "Bank Account", "at_description": "Description", "at_giro_from": "Giro From", "at_giro_bank": "Giro Bank", "at_giro_no": "Giro No", "at_nominal": "Nominal", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_giroout_code": "Giroout Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('57').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);

          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetgiroout(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;

          this.getGirooutOptions();

          this.disableInput.giroout_code = true;
          this.settings = Object.assign({}, this.mySettings());

        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  ngOnDestroy() {
    // this.subParam.unsubscribe();
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  bankAccount: any = [];
  girooutBusinesspartner: any = [];
  girooutDepartment: any = [];
  girooutProject: any = [];

  getGirooutOptions() {
    this.httpService.http_api_get('accounting/cashin/options/').subscribe((value) => {
      //DELETE GIROOUT OPTION
      if (value.success) {
        this.bankAccount = value.data.bankAccount;
        this.girooutBusinesspartner = value.data.cashinBusinesspartner;
        this.girooutDepartment = value.data.cashinDepartment;
        this.girooutProject = value.data.project;

        if (this.bankAccount.length > 0) {
          this.formGiroout.patchValue({ account_id: this.bankAccount[0].value });
        }
        if (this.girooutBusinesspartner.length > 0) {
          this.formGiroout.patchValue({ businesspartner_id: this.girooutBusinesspartner[0].value });
        }
        if (this.girooutDepartment.length > 0) {
          this.formGiroout.patchValue({ department_id: this.girooutDepartment[0].department_id });
        }
        if (this.girooutProject.length > 0) {
          this.formGiroout.patchValue({ project_id: this.girooutProject[0].project_id });
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  girooutParse;
  submitFormGiroout() {

    this.girooutParse = this.copying(this.formGiroout.getRawValue());
    this.girooutParse.update_by = this.httpService.currentUser.employee_id;
    this.girooutParse.update_datetime = new Date();

    if (this.formGiroout.value.giroout_id == '') {

      this.girooutParse.create_by = this.httpService.currentUser.employee_id;
      this.girooutParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/giroout', this.girooutParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.girooutParse.giroout_id = value.data.lastId;
            this.girooutParse.old_status_id = this.girooutParse.status_id;
            this.girooutParse.general_journal_id = value.data.general_journal_id;
            this.girooutParse.giroout_code = value.data.giroout_code;
            this.setgiroout(this.girooutParse);

            this.glTransactionGlLinkId = this.formGiroout.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateGiroout();
    }
  }

  deleteGiroout() {

    if (confirm("Are you sure to delete this data?")) {
      this.formGiroout.patchValue({ is_active: 0 });
      this.submitFormGiroout();
    }

  }

  updateGiroout() {

    this.httpService.http_api_put('accounting/giroout', this.girooutParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.girooutParse.old_status_id = this.girooutParse.status_id;
          this.setgiroout(this.girooutParse);
          if (this.formGiroout.value.is_active == 0) {
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

  outputClearall: string = '';
  clearAll() {
    this.httpService.d = new Date();
    this.datetimeModel = this.httpService.datetimeModel();
    this.datetimeModel1 = this.httpService.datetimeModel();
    this.datetimeModel2 = this.httpService.datetimeModel();
    this.setgiroout(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Giroout';
    this.ModalGetgiroout(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setgiroout(this.ModalSelectedGiroout);
    this.glTransactionGlLinkId = this.formGiroout.value.general_journal_id;
    this.modalHide();
  }

  public ModalGiroout: any = [];
  public ModalHeader: string;
  public ModalSelectedGiroout: any;

  ModalGetgiroout(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalGiroout = JSON.parse("[]");
    this.httpService.http_api_post('accounting/giroout/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.giroout[0]) {
            this.setgiroout(value.data.giroout[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalGiroout = value.data.giroout;
          this.source.load(this.ModalGiroout);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectGiroout(item) {

    this.ModalSelectedGiroout = item.data;
    this.modalOut();
    this.modalHide();

  }

  setgiroout(data) {
    if (data) {
      data.account_id = "" + data.account_id + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      data.efective_begin = moment(data.efective_begin).format("YYYY-MM-DD")
      data.efective_end = moment(data.efective_end).format("YYYY-MM-DD")
      this.formGiroout.patchValue({ ...this.copying(data) });
    } else {
      this.formGiroout.reset(this._formGiroout)
    }

  }

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        add: false,
        edit: false,
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.td_select}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        giroout_code: {
          title: this.gen.th_giroout_code,
          type: 'string',
          show: 1
        },
        transaction_date: {
          title: this.gen.th_date,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.th_description,
          type: 'string',
          show: 1
        },
      }),
      pager: {
        perPage: 75
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();

  outputEditGL(event) {
    this.inputEditGL = event;
  }

  outGllist() {
    this.inputGllist = Math.random().toString();
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
