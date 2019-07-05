import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'reconciliation_bank',
  templateUrl: './reconciliation_bank.html',
})
export class Reconciliation_bank {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;

  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formReconciliation_bank: any;

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

  _formReconciliation_bank = { reconciliation_bank_id: '', general_journal_id: '', reconciliation_bank_code: '', account_id: '', transaction_date: moment().format("YYYY-MM-DD"), reference: '', nominal: 0, description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formReconciliation_bank = this.formBuilder.group({
      reconciliation_bank_id: '',
      general_journal_id: '',
      reconciliation_bank_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      reference: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      nominal: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formReconciliation_bank');
    console.log(this.formReconciliation_bank);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Reconciliation_bank", "_code": "General Reconciliation_bank Code", "_titleModal1": "Title Modal", "ph_reconciliation_bank_no": "Reconciliation_bank Code", "ph_description": "Description", "ph_check_no": "Check No", "ph_nominal": "Nominal", "at_reconciliation_bank_Code": "Reconciliation_bank Code", "at_date": "Date", "at_bank_account": "Bank Account", "at_businesspartner": "Businesspartner", "at_description": "Description", "at_check_no": "Check No", "at_nominal": "Nominal", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_reconciliation_bank_code": "Reconciliation_bank Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('59').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetreconciliation_bank(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;

          this.getReconciliation_bankOptions();

          this.disableInput.reconciliation_bank_code = true;

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

  getReconciliation_bankOptions() {
    this.httpService.http_api_get('accounting/cashin/options/').subscribe((value) => {

      if (value.success) {
        this.bankAccount = value.data.bankAccount;
        if (this.bankAccount.length > 0) {
          this.formReconciliation_bank.patchValue({ account_id: this.bankAccount[0].value })
          this.accountChange(this.bankAccount[0]);
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  reconciliation_bankParse;
  submitFormReconciliation_bank() {

    this.reconciliation_bankParse = this.copying(this.formReconciliation_bank.getRawValue());
    this.reconciliation_bankParse.update_by = this.httpService.currentUser.employee_id;
    this.reconciliation_bankParse.update_datetime = new Date();

    if (this.formReconciliation_bank.value.reconciliation_bank_id == '') {

      this.reconciliation_bankParse.create_by = this.httpService.currentUser.employee_id;
      this.reconciliation_bankParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/reconciliation_bank', this.reconciliation_bankParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.reconciliation_bankParse.reconciliation_bank_id = value.data.lastId;
            this.reconciliation_bankParse.general_journal_id = value.data.general_journal_id;
            this.reconciliation_bankParse.reconciliation_bank_code = value.data.reconciliation_bank_code;
            this.setreconciliation_bank(this.reconciliation_bankParse);

            this.glTransactionGlLinkId = this.formReconciliation_bank.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateReconciliation_bank();
    }
  }

  deleteReconciliation_bank() {

    if (confirm("Are you sure to delete this data?")) {
      this.formReconciliation_bank.patchValue({ is_active: 0 });
      this.submitFormReconciliation_bank();
    }

  }

  updateReconciliation_bank() {

    this.httpService.http_api_put('accounting/reconciliation_bank', this.reconciliation_bankParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setreconciliation_bank(this.reconciliation_bankParse);
          if (this.formReconciliation_bank.value.is_active == 0) {
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
    this.setreconciliation_bank(false);
    this.setreconciliation_bank(this.reconciliation_bankParse);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Reconciliation_bank';
    this.ModalGetreconciliation_bank(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setreconciliation_bank(this.ModalSelectedReconciliation_bank);
    this.glTransactionGlLinkId = this.formReconciliation_bank.value.general_journal_id;
    this.modalHide();
  }

  public ModalReconciliation_bank: any = [];
  public ModalHeader: string;
  public ModalSelectedReconciliation_bank: any;

  ModalGetreconciliation_bank(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalReconciliation_bank = JSON.parse("[]");
    this.httpService.http_api_post('accounting/reconciliation_bank/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.reconciliation_bank[0]) {
            this.setreconciliation_bank(value.data.reconciliation_bank[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalReconciliation_bank = value.data.reconciliation_bank;
          this.source.load(this.ModalReconciliation_bank);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectReconciliation_bank(item) {

    this.ModalSelectedReconciliation_bank = item.data;
    this.modalOut();
    this.modalHide();

  }

  setreconciliation_bank(data) {
    if (data) {
      data.account_id = "" + data.account_id + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.formReconciliation_bank.patchValue({ ...this.copying(data) });
    } else {
      this.formReconciliation_bank.reset(this._formReconciliation_bank)
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
        reconciliation_bank_code: {
          title: this.gen.th_reconciliation_bank_code,
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
