import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { Location } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';
import { Inventory } from 'app/inventory';
import { CHECKBOX_VALUE_ACCESSOR } from '@angular/forms/src/directives/checkbox_value_accessor';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'inventory_in',
  styleUrls: ['./inventory_in.scss'],
  templateUrl: './inventory_in.html',
})
export class Inventory_in {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  @ViewChild('childModal3') public childModal3: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';

  currentUser: any = { employee_job_id: 0 };
  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  private urllink: any;

  FormInventory;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormInventory = { inventoryledger_id: '', quantity: 1, debit: 0, credit: 0, inventoryledger_link_id: '', inventory_id: '', inventory_name: '', rate: '', hpp: '', warehouse_id: '', warehouse: '', uom1: '', inventory_code: '', description: '-', currency_id: '', isfix_asset: 0, expired_date: new Date(), reminder_expired_date: '', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, expired_dates: 0, }

  _FormInventory = { inventory_stock_change_id: '', general_journal_id: '', inventoryledger_link_id: '', transaction_date: moment().format("YYYY-MM-DD"), reference: '', branch_id: '', type_id: '1', isimported: 0, methode_id: 1, account_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  expired_dates = 0;

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private location: Location,
    private sanitized: DomSanitizer
  ) {

    this.ModalFormInventory = this.formBuilder.group({ //sssss
      inventoryledger_id: '',
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      debit: 0,
      credit: 0,
      inventoryledger_link_id: '',
      inventory_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      inventory_name: '',
      rate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      hpp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse: '',
      uom1: '',
      inventory_code: '',
      description: '-',
      currency_id: '',
      isfix_asset: 0,
      expired_date: new Date(),
      reminder_expired_date: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      expired_dates: [0, [Validators.minLength(0), Validators.maxLength(11)]],
    });

    this.FormInventory = this.formBuilder.group({ //sssss
      inventory_stock_change_id: '',
      general_journal_id: '',
      inventoryledger_link_id: '',
      transaction_date: moment().format("YYYY-MM-DD"),
      reference: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      type_id: '1',
      isimported: 0,
      methode_id: 1,
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

  }

  printConsoleForm() {
    console.log('this.FormInventory');
    console.log(this.FormInventory);
    console.log('this.ModalFormInventory');
    console.log(this.ModalFormInventory);
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
    this.httpService.getTranslate('70').subscribe(
      value => {
        console.log(value)
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.settings2 = Object.assign({}, this.mySettings2());
          this.currentUser = this.httpService.currentUser;

          this.getBranch();
          this.getAccountData();
          this.getWarehouse();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  inventoryParse: any = {};

  FormInventorySubmit() {

    this.inventoryParse = this.copying(this.FormInventory.getRawValue());
    this.inventoryParse.create_by = this.httpService.currentUser.employee_id;
    this.inventoryParse.update_by = this.httpService.currentUser.employee_id;
    this.inventoryParse.update_datetime = new Date();
    this.inventoryParse.create_datetime = new Date();
    this.inventoryParse.detail = this.ininventories;

    this.httpService.http_api_post('accounting/inventoryin', this.inventoryParse)
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
          this.getIninventories();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  getInventoryin() {
    this.httpService.http_api_get('accounting/inventoryin/list/').subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.InventoryinList);
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

  modal2Select(event) {
    this.setinventory(event.data);
    this.getIninventories();
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
    this.ininventories = JSON.parse("[]");
    this.setinventory(false);
    this.setModalinventory(false);
  }

  edit() {

  }

  indexModalShow = '';
  modalShow(index) {

    this.ModalHeader = 'Inventory Detail';
    this.getInventory(index);
    if (index == '-') {
      this.setModalinventory(false);
      this.ModalFormInventory.patchValue({ inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id })
      this.ModalHeader = this.gen._titleModal1;
    } else {
      this.indexModalShow = index;
      this.ininventories[index].inventory_id = "" + this.ininventories[index].inventory_id + "";
      if (this.ininventories[index].expired_date == '3014-12-25 00:00:00') {
        this.expired_dates = 1;
        this.expiredDatesChange();
      }
      this.setModalinventory(this.ininventories[index]);
      this.ModalHeader = this.gen._titleModal12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2(item) {
    this.getInventoryin();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {
    this.indexModalShow = '';
    this.modalHide();
  }

  clearAll2() {
    this.glTransactionGlLinkId = '';
    this.inputGllist = Math.random().toString();
  }

  ininventories: any = [];

  getIninventories() {
    this.httpService.http_api_post('accounting/inventoryin/s', { inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id }).subscribe((value) => {

      if (value.success) {
        this.ininventories = value.data.inventory;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  public ModalHeader: string;

  ModalFormInventory;
  ModalInventoryParse;

  ModalFormSubmit() {

    this.ModalInventoryParse = this.copying(this.ModalFormInventory.getRawValue());
    this.ModalInventoryParse.create_by = this.httpService.currentUser.employee_id;
    this.ModalInventoryParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalInventoryParse.update_datetime = new Date();
    this.ModalInventoryParse.create_datetime = new Date();

    if (this.expired_dates != 0) {
      this.ModalInventoryParse.expired_date = this.expiredDates[this.expired_dates].date;
      this.ModalInventoryParse.reminder_expired_date = this.expiredDates[this.expired_dates].reminder;
    }

    console.log(this.indexModalShow);
    if (this.indexModalShow === '') {
      this.ininventories.push(this.ModalInventoryParse);
    } else {
      this.ininventories[this.indexModalShow] = this.copying(this.ModalInventoryParse);
    }

    this.modalOut();

  }

  setinventory(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      data.account_id = "" + data.account_id + ""
      this.FormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.FormInventory.reset(this._FormInventory)
    }

    if (this.FormInventory.value.inventory_stock_change_id == '') {
      this.disableInput.account_id = false;
    } else {
      this.disableInput.account_id = true;
    }

    if (this.FormInventory.value.isimported == 1) {
      this.disableInput.reference = true;
      this.disableInput.hpp = true;
      this.disableInput.inventory_id = true;
      this.disableInput.warehouse_id = true;
      this.disableInput.quantity = true;
      this.disableInput.rate = true;
    } else {
      this.disableInput.reference = false;
      this.disableInput.hpp = false;
      this.disableInput.inventory_id = false;
      this.disableInput.warehouse_id = false;
      this.disableInput.quantity = false;
      this.disableInput.rate = false;
    }

  }

  setModalinventory(data) {
    if (data) {
      data.expired_date = moment(data.expired_date).format("YYYY-MM-DD")
      data.inventory_id = "" + data.inventory_id + "";
      data.warehouse_id = "" + data.warehouse_id + "";
      this.ModalFormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.ModalFormInventory.reset(this._ModalFormInventory)
    }
  }
  inventoryData: any = [];
  getInventory(index) {
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 0 }).subscribe((value) => {

      if (value.success) {
        this.inventoryData = value.data.inventory;
        if (index != '-') {
          for (let item of this.inventoryData) {
            if (item.inventory_id == this.ininventories[index].inventory_id) {
              this.inventoryChange(item);
            }
          }
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
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

  expiredDates = [];

  inventoryChange(event) {

    if (this.FormInventory.value.isimported != 1) {

      this._ModalFormInventory.inventory_name = event.label;
      this._ModalFormInventory.currency_id = event.currency_id;
      this._ModalFormInventory.isfix_asset = event.isfix_asset;
      this._ModalFormInventory.rate = event.rate;
      this._ModalFormInventory.hpp = event.hpp;
      this._ModalFormInventory.uom1 = event.uom1;
      this._ModalFormInventory.inventory_code = event.inventory_code;

      this.ModalFormInventory.patchValue({
        inventory_name: event.label,
        currency_id: event.currency_id,
        isfix_asset: event.isfix_asset,
        rate: event.rate,
        hpp: event.hpp,
        uom1: event.uom1,
        inventory_code: event.inventory_code,
      })
    }

    try {

      this.expiredDates = JSON.parse(event.expired_dates);
      if (this.expiredDates.length > 0) {
        this.expiredDates.unshift({ date: "3014-12-25 00:00:00", reminder: "0", date_show: 'New General', stock: 0 });
        this.expiredDates.unshift({ date: "", reminder: "", date_show: 'New Expired Date And Reminder', stock: 0 });
      }

      for (let item of this.expiredDates) {
        if (item.date_show == 'General') {
          var itemParse = item;
          if (this.expiredDates.splice(this.expiredDates.indexOf(item), 1)) {
            this.expiredDates[1] = itemParse;
          }

        }
      }

    } catch (e) {
      this.expiredDates = JSON.parse("[]");
    }

  }

  expiredDatesChange() {
    if (this.expired_dates != 0) {
      this.disableInput.expired_date = true;
      this.disableInput.reminder_expired_date = true;
    } else {
      this.disableInput.expired_date = false;
      this.disableInput.reminder_expired_date = false;
    }
  }

  warehouseChange(event) {
    this.ModalFormInventory.patchValue({ warehouse: event.label });
    this._ModalFormInventory.warehouse = event.label;
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

  settings2 : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings2() {
    return {
      actions: {
        add: false,
        edit: false
      },
      mode: 'external',
      delete: {
        deleteButtonContent: '*(Select',
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        product_result_code: {
          title: '*(Product Result Code',
          type: 'string',
          editable: false,
          show: 1
        },
        release_date_show: {
          title: '*(Date',
          type: 'string',
          show: 1
        },
        description: {
          title: '*(Description',
          type: 'string',
          show: 1
        },
      }),
      pager: {
        perPage: 75
      }
    }
  };
  source2: LocalDataSource = new LocalDataSource();

  modalImportShow(item) {
    if (item == 1) {

      this.httpService.http_api_post('manufacture/product_result/select', { is_use: 0 }).subscribe((value) => {

        if (value.success) {
          this.source2.load(value.data.product_result);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

      this.childModal3.show();

    } else {
      this.FormInventory.patchValue({
        isimported: 0,
        reference: ''
      })

      this.disableInput.reference = false;
    }


  }

  modal3Select(event) {

    this.httpService.http_api_post('manufacture/product_result/detail', { product_result_id: event.data.product_result_id }).subscribe((value) => {

      if (value.success) {

        this.setinventory({ inventory_stock_change_id: '', general_journal_id: '', inventoryledger_link_id: '', transaction_date: moment().format("YYYY-MM-DD"), reference: event.data.product_result_code, branch_id: '', type_id: '1', isimported: 1, methode_id: 1, account_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 });

        this.ininventories = JSON.parse("[]");

        for (let item of value.data.product_result_detail) {
          this.ininventories.push({ inventoryledger_id: '', quantity: item.quantity, debit: 0, credit: 0, inventoryledger_link_id: '', inventory_id: item.inventory_id, inventory_name: item.inventory, hpp: item.hpp, rate: item.rate, warehouse_id: event.data.warehouse_id, warehouse: event.data.warehouse, uom1: item.uom1, inventory_code: item.inventory_code, description: item.description, currency_id: item.currency_id, isfix_asset: item.isfix_asset, expired_date: '3014-12-25 00:00:00', reminder_expired_date: 0, create_by: this.httpService.currentUser.employee_id, update_by: this.httpService.currentUser.employee_id, create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 })
        }

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });

    this.childModal3.hide();
  }

  deleteDetail(item) {
    if (confirm("Are you sure to delete this data?")) {
      this.ininventories.splice(this.ininventories.indexOf(item), 1);
    }
  }

}
