import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'inventorystockchange',
  templateUrl: './inventorystockchange.html',
})
export class Inventorystockchange {

  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';

  currentUser: any = { employee_job_id: 0 };
  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  private urllink: any;

  FormInventory;
  FormInventoryList;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };


  _FormInventory = { inventory_stock_change_id: '', general_journal_id: '', inventoryledger_link_id: '', reference: '', branch_id: '', type_id: '1', methode_id: 5, transaction_date: moment().format("YYYY-MM-DD"), account_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  _FormInventoryList = { inventory_group_id: '', brand_id: '', warehouse_id: '', }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private location: Location,
    private sanitized: DomSanitizer
  ) {

    this.FormInventory = this.formBuilder.group({ //sssss
      inventory_stock_change_id: '',
      general_journal_id: '',
      inventoryledger_link_id: '',
      reference: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      type_id: '1',
      methode_id: 5,
      transaction_date: moment().format("YYYY-MM-DD"),
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.FormInventoryList = this.formBuilder.group({ //sssss
      inventory_group_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      brand_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
    });

  }

  printConsoleForm() {
    console.log('this.FormInventory');
    console.log(this.FormInventory);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  refreshComponent() {
    this.clearAll();
    this.clearAll2();
    this.ngOnInit();
  }

  gen: any = { "app_component_id": 0, "_title": "Inventory Stock Change", "_titleModal1": "Title Modal", "_titleModal2": "Title Modal", "ph_reference": "Reference", "ph_description": "Description", "ph_quantityModal1": "Quantity", "ph_rateModal1": "Rate", "ph_hppModal1": "HPP", "ph_reminderExpiredModal1": "Reminder Expired", "at_date": "Date", "at_no_reference": "No Reference", "at_branch": "Branch", "at_type": "Type", "at_methode": "Methode", "at_description": "Description", "at_inventoryModal1": "Inventory", "at_warehouseModal1": "Warehouse", "at_quantityModal1": "Quantity", "at_rateModal1": "Rate", "at_hppModal1": "HPP", "at_expiredModal1": "Expired", "at_reminderExpiredModal1": "Reminder Expired", "btn_add": "Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_clear": "Clear All", "btn_search": "Search", "btn_addInventory": "Add", "btn_clearData": "Clear Data", "btn_closeModal1": "Close", "btn_addModal1": "Add", "btn_closeModal2": "Close", "th_action": "Action", "th_no": "No", "th_warehouse": "Warehouse", "th_inventory_code": "Inventory Code", "th_inventory_name": "Inventory Name", "th_Quantity": "Quantity", "th_hpp": "HPP", "th_total": "Total", "th_dateTbl2": "Date", "th_inventoryTbl2": "Inventory", "th_warehouseTbl2": "Warehouse", "th_amountTbl2": "Amount", "th_descriptionTbl2": "Description", "th_editTbl2": "Edit", "td_edit": "Edit" };

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
    this.httpService.getTranslate('25').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.settings2 = Object.assign({}, this.mySettings2());
          this.currentUser = this.httpService.currentUser;
          this.getBranch();
          this.getWarehouse();
          this.getAccountData();
          this.getGroup();
          this.getBrand();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  inventoryParse: any = {};

  FormInventorySubmit() {
    // this.inventory = {...this.inventory, ...this.FormInventory.value}
    this.source2.getAll().then(data => this.FormInventorySubmitProcess(data));

  }

  FormInventorySubmitProcess(data) {
    this.inventoryParse = this.copying(this.FormInventory.getRawValue());

    this.inventoryParse.create_by = this.httpService.currentUser.employee_id;
    this.inventoryParse.update_by = this.httpService.currentUser.employee_id;
    this.inventoryParse.update_datetime = new Date();
    this.inventoryParse.create_datetime = new Date();
    this.inventoryParse.detail = data;

    this.httpService.http_api_post('accounting/inventorystockchange', this.inventoryParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };

          if (this.FormInventory.value.inventory_stock_change_id == '') {
            this.inventoryParse.inventoryledger_link_id = value.data.inventoryledger_link_id;
            this.inventoryParse.inventory_stock_change_id = value.data.inventory_stock_change_id;
            this.inventoryParse.general_journal_id = value.data.general_journal_id;
          }

          this.setinventory(this.inventoryParse);

          this.glTransactionGlLinkId = value.data.general_journal_id;
          this.getAdjinventories();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  getInventorychg() {
    this.httpService.http_api_get('accounting/inventorystockchange/list/').subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.InventorychgList);
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
        add: false,
        edit: false
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.th_editTbl2}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        show_date: {
          title: this.gen.th_dateTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        reference: {
          title: '*(Reference Code',
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.th_descriptionTbl2,
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

  settings2 : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings2() {
    return {
      actions: {
        add: false,
        delete: false
      },
      mode: 'inline',
      edit: {
        editButtonContent: `${this.gen.td_edit}`,
        confirmSave: true,
      },
      columns: this.httpService.generateng2columns({
        warehouse: {
          title: '*(Warehouse',
          type: 'string',
          editable: false,
          show: 1
        },
        inventory_code: {
          title: '*(Inventory Code',
          type: 'string',
          editable: false,
          show: 1
        },
        name: {
          title: '*(Inventory Name',
          type: 'string',
          editable: false,
          show: 1
        },
        ex_date_show: {
          title: '*(Expired Date',
          type: 'string',
          editable: false,
          show: 1
        },
        stock: {
          title: '*(Ballance',
          type: 'number',
          editable: false,
          show: 1
        },
        quantity: {
          title: '*(Quantity',
          type: 'number',
          show: 1
        },
      }),
      pager: {
        perPage: 75
      }
    }
  };
  source2: LocalDataSource = new LocalDataSource();

  modal2Select(event) {
    this.setinventory(event.data);
    this.getAdjinventories();
    this.glTransactionGlLinkId = event.data.general_journal_id;
    this.modalHide2();
  }

  outGllist() {
    this.inputGllist = Math.random().toString();
  }

  outputClearall: string = '';
  clearAll() {
    this.outputClearall = Math.random().toString();
    this.glTransactionGlLinkId = '';
    this.chginventories = JSON.parse("[]");
    this.setinventory(false);
    this.source2.load([]);
  }

  edit() {

  }

  modalShow2(item) {
    this.getInventorychg();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  clearAll2() {
    this.glTransactionGlLinkId = '';
    this.inputGllist = Math.random().toString();
  }

  chginventories: any = [];

  getAdjinventories() {
    this.httpService.http_api_post('accounting/inventorystockchange/s', { inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id, inventory_group_id: this.FormInventoryList.value.inventory_group_id, brand_id: this.FormInventoryList.value.brand_id, warehouse_id: this.FormInventoryList.value.warehouse_id }).subscribe((value) => {

      if (value.success) {
        this.chginventories = value.data.inventory;
        console.log(value.data.inventoryList)
        console.log(this.chginventories)
        this.source2.load(value.data.inventoryList);
        this.source2Change = 0;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }
  public ModalHeader: string;

  setinventory(data) {
    if (data) {
      data.account_id = "" + data.account_id + ""
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.FormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.FormInventory.reset(this._FormInventory)
    }

    if (this.FormInventory.value.inventory_stock_change_id == '') {
      this.disableInput.account_id = false;
    } else {
      this.disableInput.account_id = true;
    }
  }

  accountData: any = [];
  getAccountData() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.accountData = value.data.account;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  warehouseData: any = [];
  warehouseDataSearch: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        this.warehouseDataSearch = value.data.warehouse;
        this.warehouseDataSearch.unshift({ value: '-', label: "In All Warehouse" });
        this.FormInventoryList.patchValue({ warehouse_id: '-' });
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  branchData: any = [];
  getBranch() {
    this.httpService.http_api_post('apps/branch/select', { is_use: 1 }).subscribe((value) => {

      if (value.success) {
        this.branchData = value.data.branch;
        if (this.branchData.length > 0) {
          this.FormInventory.patchValue({ branch_id: this.branchData[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  inventoryGroup: any = [];
  getGroup() {
    this.httpService.http_api_post('apps/inventory_group/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.inventoryGroup = value.data.inventory_group;
          this.inventoryGroup.unshift({ value: '-', label: "In All Warehouse" });
          this.FormInventoryList.patchValue({ inventory_group_id: '-' });
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  brand: any = [];
  getBrand() {
    this.httpService.http_api_post('apps/brand/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.brand = value.data.brand;
          this.brand.unshift({ value: '-', label: "In All Warehouse" });
          this.FormInventoryList.patchValue({ brand_id: '-' });
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  FormInventoryListSubmit() {

    if (this.source2Change == 1) {
      if (confirm("Data yang anda rubah belum di simpan, silahkan di simpan terlebih dahulu atau klik ok jika anda ingin membatalakn perubahan yang anda buat")) {
        this.getAdjinventories();
      }
    } else {
      this.getAdjinventories();
    }

  }

  source2Change = 0;
  editConfirm(event) {

    if (Number(event.newData.quantity)) {
      event.confirm.resolve();
      this.source2Change = 1;
    } else {
      this.notif.error = { title: 'Warning', content: 'Please Insert Number', setting: this.httpService.error, change: Math.random().toString() };
      event.confirm.reject();
    }

  }

}
