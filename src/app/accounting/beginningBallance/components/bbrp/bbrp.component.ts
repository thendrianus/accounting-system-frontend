import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'bbrp',
  templateUrl: './bbrp.html',
})
export class Bbrp {

  @ViewChild('childModal') public childModal: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;
  title: string = "";

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

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date(), jsdate: new Date() };
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormRp = { receive_payable_id: '', receive_payable_type: 1, general_journal_id: '', reference: '', businesspartner_id: '', duedays: '', branch_id: '', description: '-', transaction_date: '', account_id: '', debit: 0, credit: 0, ballance: 0, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, plus: 0, nominal: 0, }

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private location: Location,
    private sanitized: DomSanitizer
  ) {

    this.ModalFormRp = this.formBuilder.group({
      receive_payable_id: '',
      receive_payable_type: 1,
      general_journal_id: '',
      reference: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      duedays: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      debit: 0,
      credit: 0,
      ballance: 0,
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      plus: 0,
      nominal: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.ModalFormRp');
    console.log(this.ModalFormRp);
  }

  checkreceive_payable_type(url) {

    if (url.indexOf('bbpayable') != -1) {
      this._ModalFormRp.receive_payable_type = 2;
      this.ModalFormRp.patchValue({ receive_payable_type: 2 });
      this.getBbrpAccount(2);
    } else {
      this._ModalFormRp.receive_payable_type = 1;
      this.ModalFormRp.patchValue({ receive_payable_type: 1 });
      this.getBbrpAccount(1);
    }

    this.getBbrpBbrpBranch();
    this.getBbrpList();
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Begining Ballance Receive Payable", "_titleModal1": "Modal Title", "ph_debit": "Debit", "ph_po_number": "PO Number", "ph_due_days": "Due Days", "ph_description": "Description", "at_date": "Date", "at_account": "Account", "at_debit": "Debit", "at_po_number": "PO Number", "at_business_partner": "Business Partner", "at_due_days": "Due Days", "at_branch": "Branch", "at_description": "Description", "btn_clear_data": "Clear Data", "btn_closeModal1": "Close", "btn_addModal1": "Add", "btn_editModal1": "Edit", "btn_deleteModal1": "Delete", "th_date": "Date", "th_partner": "Partner", "th_po_number": "PO Number", "th_amount": "Amount", "th_description": "Description", "td_detail": "Detail", "td_edit": "Edit", "td_add": "Add" };

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
    this.httpService.getTranslate('20').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings())
          this.checkreceive_payable_type(this.location.prepareExternalUrl(this.location.path()));
          this.currentUser = this.httpService.currentUser;
          this.getBbrpBusinessPartner();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  getBbrpList() {
    this.httpService.http_api_post('accounting/bbrp/list', { receive_payable_type: this.ModalFormRp.value.receive_payable_type }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.BbrpList);
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
        show_date: {
          title: this.gen.th_date,
          type: 'string',
          editable: false,
          show: 1
        },
        businesspartner_name: {
          title: this.gen.th_partner,
          type: 'string',
          show: 1
        },
        reference: {
          title: this.gen.th_po_number,
          type: 'string',
          show: 1
        },
        nominal: {
          title: this.gen.th_amount,
          valuePrepareFunction: (value) => { return value === 'Total' ? value : Intl.NumberFormat('en-US').format(value) },
          type: 'number',
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

  deleteConfirm(event) {

    this.glTransactionGlLinkId = event.data.general_journal_id;

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
      if (this._ModalFormRp.receive_payable_type == 2) {
        this.ModalHeader = this.gen._titleModal1P;
      } else {
        this.ModalHeader = this.gen._titleModal1R;
      }
      this.setModalRp(this._ModalFormRp);

    } else {
      if (this._ModalFormRp.receive_payable_type == 2) {
        this.ModalHeader = this.gen._titleModal1EditP;
      } else {
        this.ModalHeader = this.gen._titleModal1EditR;
      }
      item.data.account_id = "" + item.data.account_id + "";
      item.data.businesspartner_id = "" + item.data.businesspartner_id + "";
      this.setModalRp(item.data);
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.glTransactionGlLinkId = this.ModalFormRp.value.general_journal_id
    this.getBbrpList();
    this.inputGllist = Math.random().toString();
    this.modalHide();
  }

  public ModalHeader: string;

  ModalFormRp;
  ModalRpParse;

  ModalFormSubmit() {

    this.ModalRpParse = this.copying(this.ModalFormRp.getRawValue());

    if (this.ModalRpParse.plus == 1) {
      this.ModalRpParse.debit = this.ModalRpParse.nominal - this.ModalRpParse.ballance;
      this.ModalRpParse.credit = 0;
    } else {
      this.ModalRpParse.debit = 0;
      this.ModalRpParse.credit = this.ModalRpParse.nominal - this.ModalRpParse.ballance;
    }

    this.ModalRpParse.create_by = this.httpService.currentUser.employee_id;
    this.ModalRpParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalRpParse.update_datetime = new Date();
    this.ModalRpParse.create_datetime = new Date();

    if (this.ModalRpParse.receive_payable_id == '') {
      this.httpService.http_api_post('accounting/bbrp', this.ModalRpParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setModalRp(this.ModalRpParse);
            this.ModalFormRp.patchValue({
              receive_payable_id: value.data.lastId,
              general_journal_id: value.data.general_journal_id,
              receive_payable_code: value.data.receive_payable_code
            })

            this.modalOut();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.ModalUpdateRp();
    }

  }

  ModalUpdateRp() {

    this.ModalRpParse = this.copying(this.ModalFormRp.getRawValue());
    this.ModalRpParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalRpParse.update_datetime = new Date();

    this.httpService.http_api_put('accounting/bbrp', this.ModalRpParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.ModalFormRp.value.is_active == 0) {
            this.modalHide();
          } else {
            this.setModalRp(this.ModalRpParse);
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

  ModalDeleteRp() {

    if (confirm("Are you sure to delete this data?")) {
      this.ModalFormRp.patchValue({is_active: 0});
      this.ModalUpdateRp();
    }

  }

  setModalRp(data) {
    data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
    this.ModalFormRp.patchValue({ ...this.copying(data) });
  }

  BbrpAccount: any = [];
  getBbrpAccount(type) {

    this.httpService.http_api_post('accounting/bbrp/account', { receive_payable_type: type }).subscribe((value) => {

      if (value.success) {
        this.BbrpAccount = value.data.account;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  BbrpBusinessPartner: any = [];
  getBbrpBusinessPartner() {
    this.httpService.http_api_post('accounting/bbrp/partner', { receive_payable_type: this.ModalFormRp.value.receive_payable_type }).subscribe((value) => {

      if (value.success) {
        this.BbrpBusinessPartner = value.data.businessPartner;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  BbrpBranch: any = [];
  getBbrpBbrpBranch() {
    this.httpService.http_api_get('accounting/bbrp/branch/').subscribe((value) => {

      if (value.success) {
        this.BbrpBranch = value.data.branch;
        if (this.BbrpBranch.length > 0) {
          this._ModalFormRp.branch_id = this.BbrpBranch[0].branch_id;
          this.ModalFormRp.patchValue({ branch_id: this.BbrpBranch[0].branch_id });
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
    this.ModalFormRp.patchValue({ plus: event.plus });
    this.moneyOption.prefix = event.currency_id + '. ';
  }

}
