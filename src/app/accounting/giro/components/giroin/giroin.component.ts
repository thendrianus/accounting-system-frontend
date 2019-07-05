import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'giroin',
  templateUrl: './giroin.html',
})
export class Giroin {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel1 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  currentUser: any = { employee_job_id: 0 };

  formGiroin: any;

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

  _formGiroin = { giroin_id: '', general_journal_id: '', giroin_code: '', account_id: '', transaction_date: moment().format("YYYY-MM-DD"), efective_begin: moment().format("YYYY-MM-DD"), efective_end: moment().format("YYYY-MM-DD"), giro_no: '', nominal: 0, giro_from: '', giro_bank: '', project_id: '', description: '-', status_id: 1, old_status_id: 1, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formGiroin = this.formBuilder.group({
      giroin_id: '',
      general_journal_id: '',
      giroin_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
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
      create_datetime: [new Date()],
      update_datetime: [new Date()],
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
    console.log('this.formGiroin');
    console.log(this.formGiroin);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Giroin", "_code": "General Giroin Code", "_titleModal1": "Title Modal", "ph_giroin_no": "Giroin Code", "ph_description": "Description", "ph_giro_from": "Giro From", "ph_giro_bank": "Giro Bank", "ph_giro_no": "Giro No", "ph_nominal": "Nominal", "ph_status": "Status", "ph_pending": "Pending", "ph_cleared": "Cleared", "ph_cancel": "Cancel", "ph_project": "Project", "at_giroin_Code": "Giroin Code", "at_date": "Date", "at_bank_account": "Bank Account", "at_description": "Description", "at_giro_from": "Giro From", "at_giro_bank": "Giro Bank", "at_giro_no": "Giro No", "at_nominal": "Nominal", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_giroin_code": "Giroin Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('56').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetgiroin(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;

          this.getGiroinOptions();

          this.disableInput.giroin_code = true;
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
  giroinBusinesspartner: any = [];
  giroinDepartment: any = [];
  giroinProject: any = [];

  getGiroinOptions() {
    this.httpService.http_api_get('accounting/cashin/options/').subscribe((value) => {
      //DELETE GIROIN OPTION
      if (value.success) {
        this.bankAccount = value.data.bankAccount;
        this.giroinBusinesspartner = value.data.cashinBusinesspartner;
        this.giroinDepartment = value.data.cashinDepartment;
        this.giroinProject = value.data.project;

        if (this.bankAccount.length > 0) {
          this.formGiroin.patchValue({ account_id: this.bankAccount[0].value });
          this.accountChange(this.bankAccount[0]);
        }
        if (this.giroinBusinesspartner.length > 0) {
          this.formGiroin.patchValue({ businesspartner_id: this.giroinBusinesspartner[0].value });
        }
        if (this.giroinDepartment.length > 0) {
          this.formGiroin.patchValue({ department_id: this.giroinDepartment[0].department_id });
        }
        if (this.giroinProject.length > 0) {
          this.formGiroin.patchValue({ project_id: this.giroinProject[0].project_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  giroinParse;
  submitFormGiroin() {

    this.giroinParse = this.copying(this.formGiroin.getRawValue());
    this.giroinParse.update_by = this.httpService.currentUser.employee_id;
    this.giroinParse.update_datetime = new Date();

    if (this.formGiroin.value.giroin_id == '') {

      this.giroinParse.create_by = this.httpService.currentUser.employee_id;
      this.giroinParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/giroin', this.giroinParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.giroinParse.giroin_id = value.data.lastId;
            this.giroinParse.old_status_id = this.giroinParse.status_id;
            this.giroinParse.general_journal_id = value.data.general_journal_id;
            this.giroinParse.giroin_code = value.data.giroin_code;
            this.setgiroin(this.giroinParse);

            this.glTransactionGlLinkId = this.formGiroin.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateGiroin();
    }
  }

  deleteGiroin() {

    if (confirm("Are you sure to delete this data?")) {
      this.formGiroin.patchValue({ is_active: 0 });
      this.submitFormGiroin();
    }

  }

  updateGiroin() {

    this.httpService.http_api_put('accounting/giroin', this.giroinParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.giroinParse.old_status_id = this.giroinParse.status_id;
          this.setgiroin(this.giroinParse);
          if (this.formGiroin.value.is_active == 0) {
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
    this.setgiroin(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Giroin';
    this.ModalGetgiroin(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setgiroin(this.ModalSelectedGiroin);
    this.glTransactionGlLinkId = this.formGiroin.value.general_journal_id;
    this.modalHide();
  }

  public ModalGiroin: any = [];
  public ModalHeader: string;
  public ModalSelectedGiroin: any;

  ModalGetgiroin(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalGiroin = JSON.parse("[]");
    this.httpService.http_api_post('accounting/giroin/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.giroin[0]) {
            this.setgiroin(value.data.giroin[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalGiroin = value.data.giroin;
          this.source.load(this.ModalGiroin);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectGiroin(item) {

    this.ModalSelectedGiroin = item.data;
    this.modalOut();
    this.modalHide();

  }

  setgiroin(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      data.efective_begin = moment(data.efective_begin).format("YYYY-MM-DD")
      data.efective_end = moment(data.efective_end).format("YYYY-MM-DD")
      data.account_id = "" + data.account_id + ""
      this.formGiroin.patchValue({ ...this.copying(data) });
    } else {
      this.formGiroin.reset(this._formGiroin);
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
        giroin_code: {
          title: this.gen.th_giroin_code,
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

  accountChange(event) {
    this.moneyOption.prefix = event.currency_id + '. ';
  }

}
