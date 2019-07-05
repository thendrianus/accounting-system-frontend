import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'generaljournal',
  templateUrl: './generaljournal.html',
})
export class Generaljournal {

  public glTransactionGlLinkId: string = "";
  public inputEditGL: any = {};
  inputGllist: string = '';
  @ViewChild('childModal') public childModal: ModalDirective;
  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formGeneraljournal: any;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formGeneraljournal = { general_journal_id: '', general_journal_code: '', generalledger_period_id: '', transaction_date: moment().format("YYYY-MM-DD"), general_journal_type_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private sanitized: DomSanitizer
  ) {

    this.formGeneraljournal = this.formBuilder.group({
      general_journal_id: '',
      general_journal_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      generalledger_period_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      general_journal_type_id: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
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
    console.log('this.formGeneraljournal');
    console.log(this.formGeneraljournal);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "General Journal", "_code": "General Journal Code", "_titleModal1": "Title Modal", "ph_journal_no": "Journal Code", "ph_description": "Description", "at_journal_Code": "Journal Code", "at_date": "Date", "at_journal_period": "Journal Period", "at_category": "Category", "at_description": "Description", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_journal_code": "Journal Code", "th_date": "Date", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('21').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.subParam = this.route.params.subscribe(params => {
            if (params['id']) {
              this.paramId = params['id'];
              this.ModalGetgeneraljournal(2, this.paramId)
              this.glTransactionGlLinkId = this.paramId;
            }
          });

          this.currentUser = this.httpService.currentUser;

          this.getGeneraljournalOptions();

          this.disableInput.general_journal_code = true;

        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  ngOnDestroy() {
    // // this.subParam.unsubscribe();
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  generalLedgerPeriod: any = [];
  generaljournalCategory: any = [];

  getGeneraljournalOptions() {
    this.httpService.http_api_get('accounting/generaljournal/options/').subscribe((value) => {

      if (value.success) {
        this.generalLedgerPeriod = value.data.generalLedgerPeriod;
        this.generaljournalCategory = value.data.generaljournalCategory;
        console.log(this.generaljournalCategory)
        console.log(this.formGeneraljournal.value)
        if (this.generalLedgerPeriod.length > 0) {
          this.formGeneraljournal.patchValue({ generalledger_period_id: this.generalLedgerPeriod[0].generalledger_period_id })
        }
        if (this.generaljournalCategory.length > 0) {
          this.formGeneraljournal.patchValue({ general_journal_type_id: this.generaljournalCategory[0].general_journal_type_id })
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  generaljournalParse;
  submitFormGeneraljournal() {

    this.generaljournalParse = this.copying(this.formGeneraljournal.getRawValue());
    this.generaljournalParse.update_by = this.httpService.currentUser.employee_id;
    this.generaljournalParse.update_datetime = new Date();

    if (this.formGeneraljournal.value.general_journal_id == '') {

      this.generaljournalParse.create_by = this.httpService.currentUser.employee_id;
      this.generaljournalParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/generaljournal', this.generaljournalParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.generaljournalParse.general_journal_id = value.data.lastId;
            this.generaljournalParse.general_journal_code = value.data.general_journal_code;
            this.setgeneraljournal(this.generaljournalParse);

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateGeneraljournal();
    }
  }

  deleteGeneraljournal() {

    if (confirm("Are you sure to delete this data?")) {
      this.formGeneraljournal.patchValue({ is_active: 0 });
      this.submitFormGeneraljournal();
    }

  }

  updateGeneraljournal() {

    this.httpService.http_api_put('accounting/generaljournal', this.generaljournalParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setgeneraljournal(this.generaljournalParse);
          this.outGllist();
          if (this.formGeneraljournal.value.is_active == 0) {
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
    this.setgeneraljournal(false);
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Generaljournal';
    this.ModalGetgeneraljournal(1, '');
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setgeneraljournal(this.ModalSelectedGeneraljournal);
    this.glTransactionGlLinkId = this.formGeneraljournal.value.general_journal_id;
    this.modalHide();
  }

  public ModalGeneraljournal: any = [];
  public ModalHeader: string;
  public ModalSelectedGeneraljournal: any;

  ModalGetgeneraljournal(action, general_journal_id) {
    //action 1 for search, and action 2 for param
    
    this.ModalGeneraljournal = JSON.parse("[]");
    this.httpService.http_api_post('accounting/generaljournal/search', { general_journal_id: general_journal_id }).subscribe((value) => {
      console.log(value)
      if (value.success) {

        if (action == 2) {
          if (value.data.generaljournal[0]) {
            this.setgeneraljournal(value.data.generaljournal[0]);
          } else {
            this.notif.error = { title: 'Error', content: 'Data by Id not found', setting: this.httpService.error, change: Math.random().toString() };
          }
        } else {
          this.ModalGeneraljournal = value.data.generaljournal;
          this.source.load(this.ModalGeneraljournal);
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectGeneraljournal(item) {

    this.ModalSelectedGeneraljournal = item.data;
    this.modalOut();
    this.modalHide();
  }

  setgeneraljournal(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.formGeneraljournal.patchValue({ ...this.copying(data) });
      this.glTransactionGlLinkId = this.formGeneraljournal.value.general_journal_id;
    } else {
      this.formGeneraljournal.reset(this._formGeneraljournal);
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
        general_journal_code: {
          title: this.gen.th_journal_code,
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
