import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'glaction',
  templateUrl: './glaction.html',
})
export class Glaction {

  @Input() inputEditGL: any = {};
  @Input() outputClearall: any = {};
  @Input() debitCredit = 2;

  @Input() glTransactionGlLinkId: string = "";
  @Output() outGllist = new EventEmitter();

  currentUser: any = { employee_job_id: 0 };

  ngOnChanges(changes: any) {

    if (changes.inputEditGL) {
      if (!changes.inputEditGL.firstChange) {
        this.editGeneralledger(changes.inputEditGL.currentValue);
      }
    }

    if (changes.outputClearall) {
      if (!changes.outputClearall.firstChange) {
        this.clearAll();
      }
    }

  }

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

  formGeneralledger: any;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formGeneralledger = { generalledger_id: '', general_journal_id: '', account_id: '', account_code: '', account: '', debit: 0, credit: 0, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formGeneralledger = this.formBuilder.group({
      generalledger_id: '',
      general_journal_id: '',
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      account_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account: '',
      debit: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      credit: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

  }

  printConsoleForm() {
    console.log('this.formGeneralledger');
    console.log(this.formGeneralledger);
  }

  gen: any = { "app_component_id": 0, "_title": "General Journal", "_code": "General Journal Code", "_titleModal1": "Title Modal", "ph_journal_no": "Journal Code", "ph_description": "Description", "at_journal_Code": "Journal Code", "at_date": "Date", "at_journal_period": "Journal Period", "at_category": "Category", "at_department": "Department", "at_description": "Description", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_journal_code": "Journal Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('67').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getGlactionOptions();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  glactionAccount: any = [];

  getGlactionOptions() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.glactionAccount = value.data.account;
        //LET IT EMPTY.. DO NOT SET DEFAULT ACCOUNT ID SO DEBIT OR CREDIT
        //CAN HAVE CURRENCY SYMBOL WHEN USER CHANGE THE ACCOUNT
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getGllist() {
    this.outGllist.emit();
  }

  editGeneralledger(item) {
    item.account_id = "" + item.account_id + "";
    this.formGeneralledger.patchValue({ ...this.copying(item) });
  }

  clearGeneralledger() {
    this.formGeneralledger.reset(this._formGeneralledger);
  }

  submitFormGeneralledger() {

    if (this.glTransactionGlLinkId == '') {
      this.notif.error = { title: 'Error', content: 'You havent save your data', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      if (this.formGeneralledger.value.debit || this.formGeneralledger.value.credit) {
        this.formGeneralledger.patchValue({
          general_journal_id: this.glTransactionGlLinkId,
          create_by: this.httpService.currentUser.employee_id,
          update_by: this.httpService.currentUser.employee_id,
          update_datetime: new Date(),
          create_datetime: new Date()
        });

        if (this.formGeneralledger.value.generalledger_id == '') {
          this.httpService.http_api_post('accounting/generaljournal/gl', this.formGeneralledger.getRawValue())
            .subscribe((value) => {

              if (value.success) {
                this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
                this.formGeneralledger.reset(this._formGeneralledger);
                this.getGllist();
              } else {
                this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
              }

            },
              error => {
                this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
              });
        } else {
          this.updateGeneralledger();
        }
      } else {
        this.notif.error = { title: 'Error', content: 'Please Fill Debit Or Credit Amount', setting: this.httpService.error, change: Math.random().toString() };
      }
    }
  }

  updateGeneralledger() {
    this.formGeneralledger.patchValue({
      update_by: this.httpService.currentUser.employee_id,
      update_datetime: new Date()
    })

    this.httpService.http_api_put('accounting/generaljournal/gl', this.formGeneralledger.getRawValue())
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.formGeneralledger.reset(this._formGeneralledger);
          this.getGllist();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  cancelGeneralledger() {
    this.formGeneralledger.reset(this._formGeneralledger);
  }

  deleteGeneralledger() {
    if (confirm("Are you sure to delete this data?")) {
      this.formGeneralledger.patchValue({ is_active: 0 });
      this.updateGeneralledger();
    }
  }

  clearAll() {
    this.formGeneralledger.reset(this._formGeneralledger);
  }

  accountChange(event) {
    this.moneyOption.prefix = event.currency_id + '. ';
  }

}
