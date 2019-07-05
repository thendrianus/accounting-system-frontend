import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'fix_asset',
  templateUrl: './fix_asset.html',
})
export class Fix_asset {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;

  formFix_asset: any;
  currentUser: any = { employee_job_id: 0 };

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

  _formFix_asset = { fix_asset_id: '', fix_asset_code: '', inventory_id: '', inventory_name: '', general_journal_id: '', fix_asset_group_id: '', warehouse_id: '', branch_id: '', label: '', price: '', buying_date: '', currency_id: '', residue: '', rate: '', life_time: '', description: '-', status_id: '0', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, depreciation_method_id: '', max_years: 0, account_id: '', depreciation_id: '', acumulated_id: '' }

  disableInput: any = {}

  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formFix_asset = this.formBuilder.group({
      fix_asset_id: '',
      fix_asset_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      inventory_id: '',
      inventory_name: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      general_journal_id: '',
      fix_asset_group_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      label: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      price: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      buying_date: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      currency_id: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      residue: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      rate: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      life_time: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      status_id: '0',
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      depreciation_method_id: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      max_years: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      account_id: '',
      depreciation_id: '',
      acumulated_id: ''
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formFix_asset');
    console.log(this.formFix_asset);
  }

  gen: any = { "app_component_id": 0, "_title": "General Fix_asset", "_code": "General Fix_asset Code", "_titleModal1": "Title Modal", "ph_fix_asset_no": "Fix_asset Code", "ph_description": "Description", "ph_inventory_name": "Inventory Name", "ph_label": "Label", "ph_buying_date": "Buying Date", "ph_price": "Price", "ph_currency_id": "Currency", "ph_residue": "Residu", "ph_rate": "Rate", "ph_life_time": "Life Time", "ph_branch_id": "Branch", "ph_depreciation_method_id": "Depreciation Method", "ph_straight_line": "Straight Line", "ph_downline_ballance": "Downline Ballance", "ph_max_years": "Max years", "at_fix_asset_Code": "Fix_asset Code", "at_fix_asset_group_id": "Fix Asses Group", "at_warehouse_id": "Warehouse", "at_description": "Description", "at_inventory_name": "Invenotry Name", "at_label": "Label", "at_buying_date": "Buying Date", "at_price": "Price", "at_currency_id": "Currency", "at_residue": "Residu", "at_rate": "Rate", "at_life_time": "Life Time", "at_max_years": "Max years", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "btn_newfixasset": "New Fix Asset", "th_fix_asset_code": "Fix_asset Code", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('55').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.getFix_assetOptions();
          this.disableInput.fix_asset_code = true;
          this.disableInput.inventory_name = true;
          this.disableInput.price = true;
          this.disableInput.currency_id = true;
          this.disableInput.rate = true;
          this.disableInput.buying_date = true;
          this.disableInput.depreciation_method_id = true;
          this.disableInput.max_years = true;
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

  warehouseList: any = [];
  branchList: any = [];
  fix_asset_groupList: any = [];
  fix_assetBusinesspartner: any = [];
  fix_assetDepartment: any = [];
  fix_assetProject: any = [];

  getFix_assetOptions() {
    this.httpService.http_api_get('accounting/fix_asset/options/').subscribe((value) => {

      if (value.success) {
        this.warehouseList = value.data.warehouseList;
        this.branchList = value.data.branchList;
        this.fix_asset_groupList = value.data.fix_asset_groupList;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  fixAssetGroupChange() {
    for (var key in this.fix_asset_groupList) {
      if (this.fix_asset_groupList[key].fix_asset_group_id == this.formFix_asset.value.fix_asset_group_id) {
        this.formFix_asset.patchValue({
          max_years: this.fix_asset_groupList[key].max_years,
          depreciation_method_id: this.fix_asset_groupList[key].depreciation_method_id,
          account_id: this.fix_asset_groupList[key].account_id,
          depreciation_id: this.fix_asset_groupList[key].depreciation_id,
          acumulated_id: this.fix_asset_groupList[key].acumulated_id,
        })
      }
    }
  }

  fix_assetParse;

  submitFormFix_asset() {

    this.fix_assetParse = this.copying(this.formFix_asset.getRawValue());
    this.fix_assetParse.update_by = this.httpService.currentUser.employee_id;
    this.fix_assetParse.update_datetime = new Date();

    this.httpService.http_api_post('accounting/fix_asset', this.fix_assetParse)
      .subscribe((value) => {

        if (value.success) {

          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.fix_assetParse.fix_asset_code = value.data.fix_asset_code;
          this.formFix_asset.patchValue({ ...this.copying(this.fix_assetParse) });
          this.accountChange(this.formFix_asset.getRawValue());

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  deleteFix_asset() {

    if (confirm("Are you sure to delete this data?")) {
      this.formFix_asset.patchValue({ is_active: 0 });
      this.submitFormFix_asset();
    }

  }

  outputClearall: string = '';
  clearAll() {
    this.httpService.d = new Date();
    this.formFix_asset.reset(this._formFix_asset);
    this.accountChange(this.formFix_asset.getRawValue());
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List Fix_asset';
    this.ModalGetfix_asset();
    this.childModal.show();
  }

  modalShow2() {
    this.ModalHeader = 'List Fix_asset';
    this.ModalGetfix_asset2();
    this.childModal2.show();
  }

  modalHide() {
    this.childModal.hide();
    this.childModal2.hide();
  }

  modalOut() {
    this.formFix_asset.patchValue({ ...this.ModalSelectedFix_asset });
    this.accountChange(this.formFix_asset.getRawValue());
    this.modalHide();
    this.fixAssetGroupChange()
  }

  public ModalFix_asset: any = [];
  public ModalFix_asset2: any = [];
  public ModalHeader: string;
  public ModalSelectedFix_asset: any;

  ModalGetfix_asset() {
    //action 1 for search, and action 2 for param
    this.ModalFix_asset = JSON.parse("[]");
    this.httpService.http_api_get('accounting/fix_asset/search/').subscribe((value) => {

      if (value.success) {

        this.ModalFix_asset = value.data.fix_asset;
        this.source.load(this.ModalFix_asset);

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalGetfix_asset2() {
    //action 1 for search, and action 2 for param
    this.ModalFix_asset = JSON.parse("[]");
    this.httpService.http_api_get('accounting/fix_asset/search2/').subscribe((value) => {

      if (value.success) {

        this.ModalFix_asset2 = value.data.fix_asset;
        this.source2.load(this.ModalFix_asset2);

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }


  ModalSelectFix_asset(item) {

    this.ModalSelectedFix_asset = item.data;
    this.modalOut();
    this.modalHide();

  }

  ModalSelectFix_asset2(item) {

    this.ModalSelectedFix_asset = item.data;
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
        fix_asset_code: {
          title: this.gen.th_fix_asset_code,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.th_description,
          type: 'string',
          show: 1
        },
      })
    }
  };
  source: LocalDataSource = new LocalDataSource();

  settings2 : any = {
    actions: {
      add: false,
      edit: false,
    },
    mode: 'external',
    delete: {
      deleteButtonContent: `${this.gen.td_select}`,
      confirmDelete: true,
    },
    columns: {
      fix_asset_code: {
        title: this.gen.th_fix_asset_code,
        type: 'string',
        show: 1
      },
      description: {
        title: this.gen.th_description,
        type: 'string'
      },
    },
    pager: {
      perPage: 75
    }
  };
  source2: LocalDataSource = new LocalDataSource();

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
