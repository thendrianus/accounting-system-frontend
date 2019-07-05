import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'cashout',
  templateUrl: './cashout.html',
})
export class Cashout {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  currentUser: any = { employee_job_id: 0 };

  formCashout: any;

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

  _formCashout = { cashout_id: '', general_journal_id: '', cashout_code: '', account_id: '', transaction_date: moment().format("YYYY-MM-DD"), businesspartner_id: '', department_id: '', check_no: '-', nominal: 0, project_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formCashout = this.formBuilder.group({
      cashout_id: '',
      general_journal_id: '',
      cashout_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      department_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      check_no: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      nominal: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      project_id: ['', [Validators.minLength(0), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
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
    console.log('this.formCashout');
    console.log(this.formCashout);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Cashout", "_code": "General Cashout Code", "_titleModal1": "Title Modal", "ph_cashout_no": "Cashout Code", "ph_description": "Description", "ph_check_no": "Check No", "ph_nominal": "Nominal", "at_cashout_Code": "Cashout Code", "at_date": "Date", "at_bank_account": "Bank Account", "at_businesspartner": "Businesspartner", "at_department": "Department", "at_description": "Description", "at_check_no": "Check No", "at_nominal": "Nominal", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_cashout_code": "Cashout Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('53').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetcashout(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;
          this.getCashoutOptions();
          this.disableInput.cashout_code = true;
          this.settings = Object.assign({}, this.mySettings())
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
  cashoutBusinesspartner: any = [];
  cashoutDepartment: any = [];
  cashoutProject: any = [];

  getCashoutOptions() {
    this.httpService.http_api_get('accounting/cashin/options/').subscribe((value) => {

      if (value.success) {
        this.bankAccount = value.data.bankAccount;
        this.cashoutBusinesspartner = value.data.cashinBusinesspartner;
        this.cashoutDepartment = value.data.cashinDepartment;
        this.cashoutProject = value.data.project;
        if (this.bankAccount.length > 0) {
          this.formCashout.patchValue({ account_id: this.bankAccount[0].value });
          this.accountChange(this.bankAccount[0]);
        }
        if (this.cashoutBusinesspartner.length > 0) {
          this.formCashout.patchValue({ businesspartner_id: this.cashoutBusinesspartner[0].value });
        }
        if (this.cashoutDepartment.length > 0) {
          this.formCashout.patchValue({ department_id: this.cashoutDepartment[0].department_id });
        }
        if (this.cashoutProject.length > 0) {
          this.formCashout.patchValue({ project_id: this.cashoutProject[0].project_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  cashoutParse;
  submitFormCashout() {

    this.cashoutParse = this.copying(this.formCashout.getRawValue());
    this.cashoutParse.update_by = this.httpService.currentUser.employee_id;
    this.cashoutParse.update_datetime = new Date();

    if (this.formCashout.value.cashout_id == '') {

      this.cashoutParse.create_by = this.httpService.currentUser.employee_id;
      this.cashoutParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/cashout', this.cashoutParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.cashoutParse.cashout_id = value.data.lastId;
            this.cashoutParse.general_journal_id = value.data.general_journal_id;
            this.cashoutParse.cashout_code = value.data.cashout_code;
            this.setcashout(this.cashoutParse);
            this.glTransactionGlLinkId = this.formCashout.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateCashout();
    }
  }

  deleteCashout() {

    if (confirm("Are you sure to delete this data?")) {
      this.formCashout.patchValue({ is_active: 0 });
      this.submitFormCashout();
    }

  }

  updateCashout() {

    this.httpService.http_api_put('accounting/cashout', this.cashoutParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setcashout(this.cashoutParse);
          if (this.formCashout.value.is_active == 0) {
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
    this.setcashout(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Cashout';
    this.ModalGetcashout(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setcashout(this.ModalSelectedCashout);
    this.glTransactionGlLinkId = this.formCashout.value.general_journal_id;
    this.modalHide();
  }

  public ModalCashout: any = [];
  public ModalHeader: string;
  public ModalSelectedCashout: any;

  ModalGetcashout(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalCashout = JSON.parse("[]");
    this.httpService.http_api_post('accounting/cashout/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.cashout[0]) {
            this.setcashout(value.data.cashout[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalCashout = value.data.cashout;
          this.source.load(this.ModalCashout);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectCashout(item) {

    this.ModalSelectedCashout = item.data;
    this.modalOut();
    this.modalHide();

  }

  setcashout(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      data.account_id = "" + data.account_id + "";
      // // data.businesspartner_id = "" + data.businesspartner_id + "";
      this.formCashout.patchValue({ ...this.copying(data) });
    } else {
      this.formCashout.reset(this._formCashout)
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
        cashout_code: {
          title: this.gen.th_cashout_code,
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
