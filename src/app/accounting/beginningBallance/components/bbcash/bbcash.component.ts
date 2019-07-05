import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'bbcash',
  templateUrl: './bbcash.html',
})
export class Bbcash {

  @ViewChild('childModal') public childModal: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;

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

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormCash = { account_bb_cash_id: '', general_journal_id: '', description: '-', transaction_date: moment().format("YYYY-MM-DD"), account_id: '', debit: 0, ballance: 0, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.ModalFormCash = this.formBuilder.group({
      account_bb_cash_id: '',
      general_journal_id: '',
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      debit: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      ballance: 0,
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
    console.log('this.ModalFormCash');
    console.log(this.ModalFormCash);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Beginning Cash", "_titleModal1": "Modal Title", "ph_debit": "Debit", "ph_description": "Description", "at_dateModal1": "Date", "at_accountModal1": "Account", "at_debitModal1": "Debit", "at_descriptionModal1": "Description", "btn_clear_data": "Clear Data", "btn_closeModal1": "Close", "btn_addModal1": "Add", "btn_editModal1": "Edit", "btn_deleteModal1": "Delete", "th_date": "Date", "th_account_name": "Account Name", "th_debit": "Debit", "th_description": "Description", "td_detail": "Detail", "td_edit": "Edit", "td_add": "Add" };

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
    this.httpService.getTranslate('19').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getBbcashList();
          this.getBbcashAccount();
          this.settings = Object.assign({}, this.mySettings());
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  getBbcashList() {
    this.httpService.http_api_get('accounting/bbcash/list/').subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.BbcashList);
        this.settings = Object.assign({}, this.mySettings())
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.td_detail}`,
        confirmDelete: true,
      },
      edit: {
        editButtonContent: `${this.gen.td_edit}`,
        confirmSave: true,
      },
      add: {
        addButtonContent: `${this.gen.td_add}`,
      },
      columns: this.httpService.generateng2columns({
        transaction_date_show: {
          title: this.gen.tn_transaction_date,
          type: 'string',
          editable: false,
          show: this.gen.ts_transaction_date
        },
        account: {
          title: this.gen.tn_account,
          type: 'string',
          editable: false,
          show: this.gen.ts_account
        },
        debit: {
          title: this.gen.tn_debit,
          valuePrepareFunction: (value) => { return value === 'Total' ? value : Intl.NumberFormat('en-US').format(value) },
          type: 'number',
          show: this.gen.ts_debit
        },
        description: {
          title: this.gen.tn_description,
          type: 'string',
          show: this.gen.ts_description
        },
      }),
      pager: {
        perPage: 75
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();

  deleteConfirm(event) {
    this.glTransactionGlLinkId = event.data.general_journal_id;
    this.outGllist();
  }

  outGllist() {
    this.inputGllist = Math.random().toString();
  }

  outputClearall: string = '';
  clearAll() {
    this.outputClearall = Math.random().toString();
    this.glTransactionGlLinkId = '';
  }

  edit() {

  }

  modalShow(item) {

    if (!item.data) {
      this.ModalHeader = this.gen._titleModal1;
    } else {
      this.ModalHeader = this.gen._titleModal1Edit;
      item.data.account_id = "" + item.data.account_id + "";
      this.setModalCash(item.data);
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {

    this.getBbcashList();
    this.inputGllist = Math.random().toString();
    this.modalHide();
  }

  public ModalHeader: string;

  ModalFormCash;
  ModalCashParse;

  ModalFormSubmit() {

    this.ModalCashParse = this.copying(this.ModalFormCash.getRawValue());
    this.ModalCashParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalCashParse.update_datetime = new Date();

    if (this.ModalCashParse.account_bb_cash_id == '') {
      this.ModalCashParse.ballance = this.ModalCashParse.debit;
      this.ModalCashParse.create_by = this.httpService.currentUser.employee_id;
      this.ModalCashParse.create_datetime = new Date();
      this.httpService.http_api_post('accounting/bbcash', this.ModalCashParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setModalCash(this.ModalCashParse);
            this.ModalFormCash.patchValue({ account_bb_cash_id: value.data.lastId });
            this.glTransactionGlLinkId = value.data.general_journal_id;
            this.modalOut();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.ModalUpdateCash();
    }

  }

  ModalUpdateCash() {

    this.ModalCashParse = this.copying(this.ModalFormCash.getRawValue());
    this.ModalCashParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalCashParse.update_datetime = new Date();

    this.httpService.http_api_put('accounting/bbcash', this.ModalCashParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.ModalFormCash.value.is_active == 0) {
            this.modalHide();
          } else {
            this.setModalCash(this.ModalCashParse);
            this.glTransactionGlLinkId = this.ModalFormCash.value.general_journal_id;
          }
          this.modalOut();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  ModalDeleteCash() {

    if (confirm("Are you sure to delete this?")) {
      this.ModalFormCash.patchValue({is_active: 0});
      this.ModalFormSubmit();
    }

  }

  setModalCash(data) {
    data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
    if (data) {
      this.ModalFormCash({ ...this.copying(data) });
    } else {
      this.ModalFormCash.reset(this._ModalFormCash)
    }

  }

  BbcashAccount: any = [];
  getBbcashAccount() {
    this.httpService.http_api_get('accounting/bbcash/account').subscribe((value) => {

      if (value.success) {
        this.BbcashAccount = value.data.account;
        if (this.BbcashAccount.length > 0) {
          this.accountChange(this.BbcashAccount[0]);
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  editConfirm(data) {

  }

  accountChange(event) {

    this.ModalFormCash.patchValue({ account_id: event.value });
    this._ModalFormCash.account_id = event.value;
    this.moneyOption.prefix = event.currency_id + '. ';

  }

}
