import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { Location } from '@angular/common';
import { forEach } from '@angular/router/src/utils/collection';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'inventorybb',
  templateUrl: './inventorybb.html',
})
export class Inventorybb {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';

  currentUser: any = { employee_job_id: 0 };
  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  private urllink: any;

  FormInventory;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormInventory = { inventoryledger_id: '', quantity: 1, debit: 0, credit: 0, inventoryledger_link_id: '', inventory_id: '', inventory_name: '', rate: 1, hpp: '', warehouse_id: '', warehouse: '', uom1: '', inventory_code: '', description: '-', currency_id: '', isfix_asset: 0, expired_date: moment().format("YYYY-MM-DD"), reminder_expired_date: 30, create_by: '-', update_by: '-', expired_dates: new Date(), create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  _FormInventory = { inventory_stock_change_id: '', general_journal_id: '', inventoryledger_link_id: '', transaction_date: moment().format("YYYY-MM-DD"), reference: '', branch_id: '', type_id: '1', methode_id: 4, account_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
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
      rate: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      hpp: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse: '',
      uom1: '',
      inventory_code: '',
      description: '-',
      currency_id: '',
      isfix_asset: 0,
      expired_date: moment().format("YYYY-MM-DD"),
      reminder_expired_date: [30, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      create_by: '-',
      update_by: '-',
      expired_dates: new Date(),
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.FormInventory = this.formBuilder.group({ //sssss
      inventory_stock_change_id: '',
      general_journal_id: '',
      inventoryledger_link_id: '',
      transaction_date: moment().format("YYYY-MM-DD"),
      reference: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      type_id: '1',
      methode_id: 4,
      account_id: '',
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
    this.httpService.getTranslate('73').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.getBranch();
          this.getWarehouse();
          this.getInventory();
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
    this.inventoryParse.detail = this.bbinventories;

    this.httpService.http_api_post('accounting/inventorybb', this.inventoryParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };

          if (this.FormInventory.value.inventory_stock_change_id == '') {
            this.inventoryParse.inventoryledger_link_id = value.data.inventoryledger_link_id;
            this.inventoryParse.inventory_stock_change_id = value.data.inventory_stock_change_id;
            this.inventoryParse.general_journal_id = value.data.general_journal_id;
          }

          this.FormInventory.patchValue({ ...this.copying(this.inventoryParse) });

          this.glTransactionGlLinkId = value.data.general_journal_id;
          this.getBbinventories();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  getInventorybb() {
    this.httpService.http_api_get('accounting/inventorybb/list/').subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.InventorybbList);
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
    this.getBbinventories();
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
    this.bbinventories = JSON.parse("[]");
    this.setinventory(false);
    this.setModalinventory(false);
  }

  edit() {

  }

  indexModalShow = '';
  modalShow(index) {

    this.ModalHeader = 'Inventory Detail';


    if (index == '-') {
      this.setModalinventory(false);
      this.ModalFormInventory.patchValue({ inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id })
      this.ModalHeader = this.gen._titleModal1;
      this.indexModalShow = '';
    } else {
      this.indexModalShow = index;

      this.setModalinventory(this.bbinventories[index]);
      this.ModalHeader = this.gen._titleModal12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2(item) {
    this.getInventorybb();
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

  bbinventories: any = [];

  getBbinventories() {
    this.httpService.http_api_post('accounting/inventorybb/s', { inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id }).subscribe((value) => {

      if (value.success) {
        this.bbinventories = value.data.inventory;
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

    if (this.indexModalShow === '') {
      this.bbinventories.push(this.ModalInventoryParse);
    } else {
      this.bbinventories[this.indexModalShow] = this.copying(this.ModalInventoryParse);
    }

    this.modalOut();

  }

  setinventory(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.FormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.FormInventory.reset(this._FormInventory)
    }
  }

  setModalinventory(data) {
    
    if (data) {
      data.inventory_id = "" + data.inventory_id + "";
      data.warehouse_id = "" + data.warehouse_id + "";
      data.expired_date = moment(data.expired_date).format("YYYY-MM-DD")
      this.ModalFormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.ModalFormInventory.reset(this._ModalFormInventory);
    }

  }

  inventoryData: any = [];
  getInventory() {
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 0 }).subscribe((value) => {

      if (value.success) {
        this.inventoryData = value.data.inventory;
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
        if (this.warehouseData.length > 0) {
          this.ModalFormInventory.patchValue({ 
            warehouse_id: `${this.warehouseData[0].warehouse_id}`,
            warehouse: `${this.warehouseData[0].warehouse}`
          });
          this._ModalFormInventory.warehouse_id= `${this.warehouseData[0].warehouse_id}`
          this._ModalFormInventory.warehouse= `${this.warehouseData[0].warehouse}`
        }
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

    this.ModalFormInventory.patchValue({
      inventory_name: event.name,
      currency_id: event.currency_id,
      isfix_asset: event.isfix_asset,
      rate: event.rate,
      hpp: event.hpp,
      uom1: event.uom1,
      inventory_code: event.inventory_code,
    })
    
    this._ModalFormInventory.inventory_name = event.label;
    this._ModalFormInventory.currency_id = event.currency_id;
    this._ModalFormInventory.isfix_asset = event.isfix_asset;
    this._ModalFormInventory.rate = event.rate;
    this._ModalFormInventory.hpp = event.hpp;
    this._ModalFormInventory.uom1 = event.uom1;
    this._ModalFormInventory.inventory_code = event.inventory_code;

    try {

      this.expiredDates = JSON.parse(event.expired_dates);
      if (this.expiredDates.length > 0) {
        this.expiredDates.unshift({ date: "3014-12-25 00:00:00", reminder: "0", date_show: 'General', stock: 0 });
        this.expiredDates.unshift({ date: "", reminder: "", date_show: 'New Expired Date And Reminder', stock: 0 });
      }

      for (let item of this.expiredDates) {
        if (item.date_show == 'General') {
          this.expiredDates.splice(1, 1);
        }
      }

    } catch (e) {
      this.expiredDates = JSON.parse("[]");
    }
    this.expired_dates = 0;
    this.expiredDatesChange();

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

  deleteDetail(item) {
    if (confirm("Are you sure to delete this data?")) {
      this.bbinventories.splice(this.bbinventories.indexOf(item), 1);
    }
  }

}
