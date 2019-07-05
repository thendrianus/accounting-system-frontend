import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'reconciliation_adj',
  templateUrl: './reconciliation_adj.html',
})
export class Reconciliation_adj {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  currentUser: any = { employee_job_id: 0 };

  formReconciliation_adj: any;

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

  _formReconciliation_adj = { reconciliation_adj_id: '', general_journal_id: '', reconciliation_adj_code: '', account_id: '', transaction_date: moment().format("YYYY-MM-DD"), reference: '', debit: '', credit: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formReconciliation_adj = this.formBuilder.group({
      reconciliation_adj_id: '',
      general_journal_id: '',
      reconciliation_adj_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      reference: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      debit: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
      credit: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
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
    console.log('this.formReconciliation_adj');
    console.log(this.formReconciliation_adj);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Reconciliation_adj", "_code": "General Reconciliation_adj Code", "_titleModal1": "Title Modal", "ph_reconciliation_adj_no": "Reconciliation_adj Code", "ph_description": "Description", "ph_check_no": "Check No", "ph_debit": "Debit", "ph_credit": "Credit", "at_reconciliation_adj_Code": "Reconciliation_adj Code", "at_date": "Date", "at_bank_account": "Bank Account", "at_businesspartner": "Businesspartner", "at_description": "Description", "at_check_no": "Check No", "at_debit": "Debit", "at_credit": "Credit", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_reconciliation_adj_code": "Reconciliation_adj Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('58').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetreconciliation_adj(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;

          this.getReconciliation_adjOptions();
          this.disableInput.reconciliation_adj_code = true;
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

  getReconciliation_adjOptions() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.bankAccount = value.data.account;
        if (this.bankAccount.length > 0) {
          this.formReconciliation_adj.patchValue({ account_id: this.bankAccount[0].value });
          this.accountChange(this.bankAccount[0]);
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  reconciliation_adjParse;
  submitFormReconciliation_adj() {

    this.reconciliation_adjParse = this.copying(this.formReconciliation_adj.getRawValue());
    this.reconciliation_adjParse.update_by = this.httpService.currentUser.employee_id;
    this.reconciliation_adjParse.update_datetime = new Date();

    if (this.formReconciliation_adj.value.reconciliation_adj_id == '') {

      this.reconciliation_adjParse.create_by = this.httpService.currentUser.employee_id;
      this.reconciliation_adjParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/reconciliation_adj', this.reconciliation_adjParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.reconciliation_adjParse.reconciliation_adj_id = value.data.lastId;
            this.reconciliation_adjParse.general_journal_id = value.data.general_journal_id;
            this.reconciliation_adjParse.reconciliation_adj_code = value.data.reconciliation_adj_code;
            this.setreconciliation_adj(this.reconciliation_adjParse);

            this.glTransactionGlLinkId = this.formReconciliation_adj.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateReconciliation_adj();
    }
  }

  deleteReconciliation_adj() {

    if (confirm("Are you sure to delete this data?")) {
      this.formReconciliation_adj.patchValue({ is_active: 0 });
      this.submitFormReconciliation_adj();
    }

  }

  updateReconciliation_adj() {

    this.httpService.http_api_put('accounting/reconciliation_adj', this.reconciliation_adjParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setreconciliation_adj(this.reconciliation_adjParse);
          if (this.formReconciliation_adj.value.is_active == 0) {
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
    this.setreconciliation_adj(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Reconciliation_adj';
    this.ModalGetreconciliation_adj(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setreconciliation_adj(this.ModalSelectedReconciliation_adj);
    this.glTransactionGlLinkId = this.formReconciliation_adj.value.general_journal_id;
    this.modalHide();
  }

  public ModalReconciliation_adj: any = [];
  public ModalHeader: string;
  public ModalSelectedReconciliation_adj: any;

  ModalGetreconciliation_adj(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalReconciliation_adj = JSON.parse("[]");
    this.httpService.http_api_post('accounting/reconciliation_adj/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.reconciliation_adj[0]) {
            this.setreconciliation_adj(value.data.reconciliation_adj[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalReconciliation_adj = value.data.reconciliation_adj;
          this.source.load(this.ModalReconciliation_adj);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectReconciliation_adj(item) {

    this.ModalSelectedReconciliation_adj = item.data;
    this.modalOut();
    this.modalHide();

  }

  setreconciliation_adj(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      data.account_id = "" + data.account_id + "";
      this.formReconciliation_adj.patchValue({ ...this.copying(data) });
    } else {
      this.formReconciliation_adj.reset(this._formReconciliation_adj)
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
        reconciliation_adj_code: {
          title: this.gen.th_reconciliation_adj_code,
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
