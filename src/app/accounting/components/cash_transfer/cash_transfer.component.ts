import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'cash_transfer',
  templateUrl: './cash_transfer.html',
})
export class Cash_transfer {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;

  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formCash_transfer: any;

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

  _formCash_transfer = { cash_transfer_id: '', general_journal_id: '', cash_transfer_code: '', account_from: '', transaction_date: moment().format("YYYY-MM-DD"), account_to: '', department_id: '', reference: '-', nominal: 0, project_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formCash_transfer = this.formBuilder.group({
      cash_transfer_id: '',
      general_journal_id: '',
      cash_transfer_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_from: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      account_to: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      department_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      reference: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formCash_transfer');
    console.log(this.formCash_transfer);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Cash_transfer", "_code": "General Cash_transfer Code", "_titleModal1": "Title Modal", "ph_cash_transfer_no": "Cash_transfer Code", "ph_description": "Description", "ph_reference": "Reference", "ph_nominal": "Nominal", "at_cash_transfer_Code": "Cash_transfer Code", "at_date": "Date", "at_account_from": "Account From", "at_account_to": "Account To", "at_department": "Department", "at_description": "Description", "at_reference": "Reference", "at_project": "Project", "at_nominal": "Nominal", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_cash_transfer_code": "Cash_transfer Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('51').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetcash_transfer(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;

          this.getCash_transferOptions();

          this.disableInput.cash_transfer_code = true;
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
  cash_transferBusinesspartner: any = [];
  cash_transferDepartment: any = [];
  cash_transferProject: any = [];

  getCash_transferOptions() {
    this.httpService.http_api_get('accounting/cashin/options/').subscribe((value) => {

      if (value.success) {
        this.bankAccount = value.data.bankAccount;
        this.cash_transferDepartment = value.data.cashinDepartment;
        this.cash_transferProject = value.data.project;

        if (this.bankAccount.length > 0) {
          this.formCash_transfer.patchValue({
            account_to: this.bankAccount[0].value,
            account_from: this.bankAccount[0].value
          })

          this.accountChange(this.bankAccount[0]);
        }
        if (this.cash_transferDepartment.length > 0) {
          this.formCash_transfer.patchValue({ department_id: this.cash_transferDepartment[0].department_id });
        }
        if (this.cash_transferProject.length > 0) {
          this.formCash_transfer.patchValue({ project_id: this.cash_transferProject[0].project_id });
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  cash_transferParse;
  submitFormCash_transfer() {

    this.cash_transferParse = this.copying(this.formCash_transfer.getRawValue());
    this.cash_transferParse.update_by = this.httpService.currentUser.employee_id;
    this.cash_transferParse.update_datetime = new Date();

    if (this.formCash_transfer.value.cash_transfer_id == '') {

      this.cash_transferParse.create_by = this.httpService.currentUser.employee_id;
      this.cash_transferParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/cash_transfer', this.cash_transferParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.cash_transferParse.cash_transfer_id = value.data.lastId;
            this.cash_transferParse.general_journal_id = value.data.general_journal_id;
            this.cash_transferParse.cash_transfer_code = value.data.cash_transfer_code;
            this.setcash_transfer(this.cash_transferParse);

            this.glTransactionGlLinkId = this.formCash_transfer.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateCash_transfer();
    }
  }

  deleteCash_transfer() {

    if (confirm("Are you sure to delete this data?")) {
      this.formCash_transfer.patchValue({is_active: 0});
      this.submitFormCash_transfer();
    }

  }

  updateCash_transfer() {

    this.httpService.http_api_put('accounting/cash_transfer', this.cash_transferParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setcash_transfer(this.cash_transferParse);
          if (this.formCash_transfer.value.is_active == 0) {
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
    this.setcash_transfer(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Cash_transfer';
    this.ModalGetcash_transfer(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setcash_transfer(this.ModalSelectedCash_transfer);
    this.glTransactionGlLinkId = this.formCash_transfer.value.general_journal_id;
    this.modalHide();
  }

  public ModalCash_transfer: any = [];
  public ModalHeader: string;
  public ModalSelectedCash_transfer: any;

  ModalGetcash_transfer(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalCash_transfer = JSON.parse("[]");
    this.httpService.http_api_post('accounting/cash_transfer/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.cash_transfer[0]) {
            this.setcash_transfer(value.data.cash_transfer[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalCash_transfer = value.data.cash_transfer;
          this.source.load(this.ModalCash_transfer);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectCash_transfer(item) {

    this.ModalSelectedCash_transfer = item.data;
    this.modalOut();
    this.modalHide();

  }

  setcash_transfer(data) {
    if (data) {
      data.account_from = "" + data.account_from + "";
      data.account_to = "" + data.account_to + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")

      this.formCash_transfer.patchValue({ ...this.copying(data) });
    } else {
      this.formCash_transfer.reset(this._formCash_transfer)
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
        cash_transfer_code: {
          title: this.gen.th_cash_transfer_code,
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
