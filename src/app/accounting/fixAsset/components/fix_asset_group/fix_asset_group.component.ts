import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'fix_asset_group',
  templateUrl: './fix_asset_group.html',
})
export class Fix_asset_group {

  @ViewChild('childModal') public childModal: ModalDirective;

  formFix_asset_group: any;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formFix_asset_group = { fix_asset_group_id: '', fix_asset_group_code: '', account_id: '', depreciation_id: '', acumulated_id: '', name: '', depreciation_method_id: '', max_years: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formFix_asset_group = this.formBuilder.group({
      fix_asset_group_id: '',
      fix_asset_group_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      depreciation_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      acumulated_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      depreciation_method_id: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      max_years: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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

  enableDisabledngselect() {
    if (this.formFix_asset_group.value.fix_asset_group_id != '') {
      this.disableInput.account_id = true;
      this.disableInput.depreciation_id = true;
      this.disableInput.acumulated_id = true;
    } else {
      this.disableInput.account_id = false;
      this.disableInput.depreciation_id = false;
      this.disableInput.acumulated_id = false;
    }
  }

  printConsoleForm() {
    console.log('this.formFix_asset_group');
    console.log(this.formFix_asset_group);
  }

  gen: any = { "app_component_id": 0, "_title": "General Fix_asset_group", "_code": "General Fix_asset_group Code", "_titleModal1": "Title Modal", "ph_fix_asset_group_no": "Fix_asset_group Code", "ph_description": "Description", "ph_name": "Name", "ph_depreciation_method_id": "Depreciation Method", "ph_straight_line": "Garis Lurus", "ph_downline_ballance": "Saldo Menurun", "ph_max_years": "Max years", "at_fix_asset_group_Code": "Fix_asset_group Code", "at_account_id": "Account", "at_depreciation_id": "Depreciation Account", "at_acumulated_id": "Acumulated Account", "at_description": "Description", "at_name": "Name", "at_max_years": "Max years", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_fix_asset_group_code": "Fix_asset_group Code", "th_description": "Description", "td_select": "Select" };

  ngOnInit() {

    if (this.httpService.is_authorization) {
      this.getGen();
    } else {
      this.httpService.authorization(true).then(value => {
        this.getGen();
      });
    }

  }

  getGen() {
    this.httpService.getTranslate('54').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.getFix_asset_groupOptions();
          this.disableInput.fix_asset_group_code = true;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  ngOnDestroy() {

  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  accountList: any = [];
  fix_asset_groupBusinesspartner: any = [];
  fix_asset_groupDepartment: any = [];
  fix_asset_groupProject: any = [];

  getFix_asset_groupOptions() {

    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 1 }).subscribe((value) => {

      if (value.success) {
        this.accountList = value.data.account;
        if (this.accountList.length > 0) {
          this.formFix_asset_group.patchValue({
            account_id: this.accountList[0].value,
            acumulated_id: this.accountList[0].value,
            depreciation_id: this.accountList[0].value
          })
          this._formFix_asset_group.account_id = this.accountList[0].value;
          this._formFix_asset_group.acumulated_id = this.accountList[0].value;
          this._formFix_asset_group.depreciation_id = this.accountList[0].value;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  fix_asset_groupParse;
  submitFormFix_asset_group() {
    this.fix_asset_groupParse = this.copying(this.formFix_asset_group.getRawValue());
    this.fix_asset_groupParse.update_by = this.httpService.currentUser.employee_id;
    this.fix_asset_groupParse.update_datetime = new Date();

    if (this.formFix_asset_group.value.fix_asset_group_id == '') {

      this.fix_asset_groupParse.create_by = this.httpService.currentUser.employee_id;
      this.fix_asset_groupParse.create_datetime = new Date();

      this.httpService.http_api_post('accounting/fix_asset_group', this.fix_asset_groupParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.fix_asset_groupParse.fix_asset_group_id = value.data.lastId;
            this.fix_asset_groupParse.fix_asset_group_code = value.data.fix_asset_group_code;
            this.formFix_asset_group.patchValue({ ...this.copying(this.fix_asset_groupParse) });
            this.enableDisabledngselect();

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateFix_asset_group();
    }
  }

  deleteFix_asset_group() {

    if (confirm("Are you sure to delete this data?")) {
      this.formFix_asset_group.patchValue({ is_active: 0 });
      this.submitFormFix_asset_group();
    }

  }

  updateFix_asset_group() {

    this.httpService.http_api_put('accounting/fix_asset_group', this.fix_asset_groupParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.formFix_asset_group.patchValue({ ...this.copying(this.fix_asset_groupParse) });
          this.enableDisabledngselect();
          if (this.formFix_asset_group.value.is_active == 0) {
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
    this.formFix_asset_group.reset(this._formFix_asset_group);
    this.enableDisabledngselect();
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Fix_asset_group';
    this.ModalGetfix_asset_group();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.formFix_asset_group.patchValue({ ...this.ModalSelectedFix_asset_group });
    this.enableDisabledngselect();
    this.modalHide();
  }

  public ModalFix_asset_group: any = [];
  public ModalHeader: string;
  public ModalSelectedFix_asset_group: any;

  ModalGetfix_asset_group() {
    //action 1 for search, and action 2 for param
    this.ModalFix_asset_group = JSON.parse("[]");
    this.httpService.http_api_get('accounting/fix_asset_group/search/').subscribe((value) => {

      if (value.success) {

        this.ModalFix_asset_group = value.data.fix_asset_group;
        this.source.load(this.ModalFix_asset_group);

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectFix_asset_group(item) {
    item.data.account_id = "" + item.data.account_id + "";
    item.data.depreciation_id = "" + item.data.depreciation_id + "";
    item.data.acumulated_id = "" + item.data.acumulated_id + "";

    this.ModalSelectedFix_asset_group = item.data;
    this.modalOut();
    this.modalHide();

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
        fix_asset_group_code: {
          title: this.gen.th_fix_asset_group_code,
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
