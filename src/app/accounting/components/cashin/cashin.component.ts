import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'cashin',
  templateUrl: './cashin.html',
})
export class Cashin {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;
  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formCashin: any;

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

  _formCashin = { cashin_id: '', general_journal_id: '', cashin_code: '', account_id: '', transaction_date: moment().format("YYYY-MM-DD"), businesspartner_id: '', department_id: '', check_no: '', nominal: 0, project_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formCashin = this.formBuilder.group({
      cashin_id: '',
      general_journal_id: '',
      cashin_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      department_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      check_no: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
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
    console.log('this.formCashin');
    console.log(this.formCashin);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Cashin", "_code": "General Cashin Code", "_titleModal1": "Title Modal", "ph_cashin_no": "Cashin Code", "ph_description": "Description", "ph_check_no": "Check No", "ph_nominal": "Nominal", "at_cashin_Code": "Cashin Code", "at_date": "Date", "at_bank_account": "Bank Account", "at_businesspartner": "Businesspartner", "at_department": "Department", "at_description": "Description", "at_check_no": "Check No", "at_nominal": "Nominal", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_cashin_code": "Cashin Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('52').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetcashin(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;
          this.getCashinOptions();
          this.disableInput.cashin_code = true;
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
  cashinBusinesspartner: any = [];
  cashinDepartment: any = [];
  cashinProject: any = [];

  getCashinOptions() {
    this.httpService.http_api_get('accounting/cashin/options/').subscribe((value) => {

      if (value.success) {
        this.bankAccount = value.data.bankAccount;
        this.cashinBusinesspartner = value.data.cashinBusinesspartner;
        this.cashinDepartment = value.data.cashinDepartment;
        this.cashinProject = value.data.project;
        if (this.bankAccount.length > 0) {
          this.formCashin.patchValue({ account_id: this.bankAccount[0].value });
          this.accountChange(this.bankAccount[0]);
        }
        if (this.cashinBusinesspartner.length > 0) {
          this.formCashin.patchValue({ businesspartner_id: this.cashinBusinesspartner[0].value });
        }
        if (this.cashinDepartment.length > 0) {
          this.formCashin.patchValue({ department_id: this.cashinDepartment[0].department_id });
        }
        if (this.cashinProject.length > 0) {
          this.formCashin.patchValue({ project_id: this.cashinProject[0].project_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  cashinParse;
  submitFormCashin() {

    this.cashinParse = this.copying(this.formCashin.getRawValue());
    this.cashinParse.update_by = this.httpService.currentUser.employee_id;
    this.cashinParse.update_datetime = new Date();

    if (this.formCashin.value.cashin_id == '') {

      this.cashinParse.create_by = this.httpService.currentUser.employee_id;
      this.cashinParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/cashin', this.cashinParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.cashinParse.cashin_id = value.data.lastId;
            this.cashinParse.general_journal_id = value.data.general_journal_id;
            this.cashinParse.cashin_code = value.data.cashin_code;
            this.setCashin(this.cashinParse);

            this.glTransactionGlLinkId = this.formCashin.value.general_journal_id;

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateCashin();
    }
  }

  deleteCashin() {

    if (confirm("Are you sure to delete this data?")) {
      this.formCashin.patchValue({ is_active: 0 });
      this.submitFormCashin();
    }

  }

  updateCashin() {

    this.httpService.http_api_put('accounting/cashin', this.cashinParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setCashin(this.cashinParse);
          if (this.formCashin.value.is_active == 0) {
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
    this.setCashin(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Cashin';
    this.ModalGetcashin(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setCashin(this.ModalSelectedCashin);
    this.glTransactionGlLinkId = this.formCashin.value.general_journal_id;
    this.modalHide();
  }

  public ModalCashin: any = [];
  public ModalHeader: string;
  public ModalSelectedCashin: any;

  ModalGetcashin(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    this.ModalCashin = JSON.parse("[]");
    this.httpService.http_api_post('accounting/cashin/search', { general_journal_id: general_journal_id }).subscribe((value) => {

      if (value.success) {

        if (action == 2) {
          if (value.data.cashin[0]) {
            this.setCashin(value.data.cashin[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalCashin = value.data.cashin;
          this.source.load(this.ModalCashin);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectCashin(item) {

    this.ModalSelectedCashin = item.data;
    this.modalOut();
    this.modalHide();

  }

  setCashin(data) {
    if (data) {
      data.account_id = "" + data.account_id + "";
      // // data.businesspartner_id = "" + data.businesspartner_id + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.formCashin.patchValue({ ...this.copying(data) });
    } else {
      this.formCashin.reset(this._formCashin)
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
        cashin_code: {
          title: this.gen.th_cashin_code,
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
