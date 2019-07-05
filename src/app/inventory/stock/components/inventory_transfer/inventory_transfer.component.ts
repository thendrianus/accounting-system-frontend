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
  selector: 'inventory_transfer',
  templateUrl: './inventory_transfer.html',
})
export class Inventory_transfer {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';

  currentUser: any = { employee_job_id: 0 };
  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  private urllink: any;

  FormInventory;;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormInventory = { inventoryledger_id: '', quantity: 1, debit: 0, credit: 0, inventoryledger_link_id: '', inventory_id: '', inventory_name: '', rate: '', hpp: '', uom1: '', inventory_code: '', description: '-', currency_id: '', isfix_asset: 0, stock: 0, newExpired: false, new_expired_dates: 0, new_expired_date: moment().format("YYYY-MM-DD"), new_reminder_expired_date: '', create_by: '-', update_by: '-', expired_dates: new Date(), create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  _FormInventory = { inventory_stock_transfer_id: '', general_journal_id: '', inventoryledger_link_id: '', transaction_date: moment().format("YYYY-MM-DD"), reference: '', branch_id: '', description: '-', from_warehouse_id: '', to_warehouse_id: '', warehouse: '', create_by: '-', update_by: '-', expired_dates: new Date(), create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  expired_dates = 0;
  new_expired_dates = 0;

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
      uom1: '',
      inventory_code: '',
      description: '-',
      currency_id: '',
      isfix_asset: 0,
      stock: 0,
      newExpired: [false, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      new_expired_dates: [0, [Validators.minLength(0), Validators.maxLength(11)]],
      new_expired_date: moment().format("YYYY-MM-DD"),
      new_reminder_expired_date: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      create_by: '-',
      update_by: '-',
      expired_dates: new Date(),
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.FormInventory = this.formBuilder.group({ //sssss
      inventory_stock_transfer_id: '',
      general_journal_id: '',
      inventoryledger_link_id: '',
      transaction_date: moment().format("YYYY-MM-DD"),
      reference: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      from_warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      to_warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse: '',
      create_by: '-',
      update_by: '-',
      expired_dates: new Date(),
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
    this.httpService.getTranslate('24').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;

          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.getBranch();
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
    this.inventoryParse.detail = this.transferinventories;

    this.httpService.http_api_post('accounting/inventorystocktransfer', this.inventoryParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };

          if (this.FormInventory.value.inventory_stock_transfer_id == '') {
            this.inventoryParse.inventoryledger_link_id = value.data.inventoryledger_link_id;
            this.inventoryParse.inventory_stock_transfer_id = value.data.inventory_stock_transfer_id;
            this.inventoryParse.general_journal_id = value.data.general_journal_id;
          }

          this.setinventory(this.inventoryParse);

          this.glTransactionGlLinkId = value.data.general_journal_id;
          this.gettransferinventories();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  getInventorytransfer() {
    this.httpService.http_api_get('accounting/inventorystocktransfer/list/').subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.InventorytransferList);
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
    this.gettransferinventories();
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
    this.transferinventories = JSON.parse("[]");
    this.setinventory(false);
    this.setModalinventory(false);
  }

  edit() {

  }

  indexModalShow = '';
  modalShow(index) {

    this.ModalHeader = 'Inventory Detail';
    this.getInventory();

    if (index == '-') {
      this.setModalinventory(false);
      this.ModalFormInventory.patchValue({ inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id })
      this.ModalHeader = this.gen._titleModal1;
    } else {
      this.indexModalShow = index;
      console.log(this.transferinventories[index]);
      this.transferinventories[index].inventory_id = "" + this.transferinventories[index].inventory_id + "";
      this.setModalinventory(this.transferinventories[index]);
      this.ModalHeader = this.gen._titleModal12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2(item) {
    this.getInventorytransfer();
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

  transferinventories: any = [];

  gettransferinventories() {
    this.httpService.http_api_post('accounting/inventorystocktransfer/s', { inventoryledger_link_id: this.FormInventory.value.inventoryledger_link_id }).subscribe((value) => {

      if (value.success) {
        this.transferinventories = value.data.inventory;
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

    this.ModalInventoryParse.expired_date = this.expiredDates[this.expired_dates].date;
    this.ModalInventoryParse.reminder_expired_date = this.expiredDates[this.expired_dates].reminder;

    if (this.new_expired_dates != 0) {
      this.ModalInventoryParse.new_expired_date = this.expiredDates[this.expired_dates].date;
      this.ModalInventoryParse.new_reminder_expired_date = this.expiredDates[this.expired_dates].reminder;
    }

    if (this.indexModalShow === '') {
      this.transferinventories.push(this.ModalInventoryParse);
    } else {
      this.transferinventories[this.indexModalShow] = this.copying(this.ModalInventoryParse);
    }

    this.disableInput.from_warehouse_id = true;
    this.disableInput.to_warehouse_id = true;

    this.modalOut();

  }

  setinventory(data) {
    if (data) {
      data.from_warehouse_id = "" + data.from_warehouse_id + "";
      data.to_warehouse_id = "" + data.to_warehouse_id + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.FormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.FormInventory.reset(this._FormInventory)
    }

    if (this.FormInventory.value.inventory_stock_transfer_id == '') {
      this.disableInput.from_warehouse_id = false;
      this.disableInput.to_warehouse_id = false;
    } else {
      this.disableInput.from_warehouse_id = true;
      this.disableInput.to_warehouse_id = true;
    }

  }

  setModalinventory(data) {
    if (data) {
      data.inventory_id = "" + data.inventory_id + "";
      this.ModalFormInventory.patchValue({ ...this.copying(data) });
    } else {
      this.ModalFormInventory.reset(this._ModalFormInventory)
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
  new_expiredDates = [];
  lastInventoryChangeEvent: any = false;
  inventoryChange(event) {
    if (event) {

      this.lastInventoryChangeEvent = this.copying(event);

      this.ModalFormInventory.patchValue({
        inventory_name: event.label,
        currency_id: event.currency_id,
        isfix_asset: event.isfix_asset,
        rate: event.rate,
        hpp: event.hpp,
        uom1: event.uom1,
        inventory_code: event.inventory_code,
        stock: 0
      })

      this._ModalFormInventory.inventory_name = event.label;
      this._ModalFormInventory.currency_id = event.currency_id;
      this._ModalFormInventory.isfix_asset = event.isfix_asset;
      this._ModalFormInventory.rate = event.rate;
      this._ModalFormInventory.hpp = event.hpp;
      this._ModalFormInventory.uom1 = event.uom1;
      this._ModalFormInventory.inventory_code = event.inventory_code;
      this._ModalFormInventory.stock = 0;

      this.expiredDates = JSON.parse("[]");
      this.new_expiredDates = JSON.parse("[]");
      console.log('item');
      try {
        var expiredDatesParse = JSON.parse(event.expired_dates);

        if (expiredDatesParse.length > 0) {
          for (let item of expiredDatesParse) {
            console.log(item);
            if (item.warehouse_id == this.FormInventory.value.from_warehouse_id) {
              this.expiredDates.push(item);

              this.expired_dates = 0;
              this.expiredDatesChange();
            }

            if (item.warehouse_id == this.FormInventory.value.to_warehouse_id) {
              this.new_expiredDates.push(item);
              this.new_expired_dates = 0;
              this.new_expiredDatesChange();
            }

          }

          this.new_expiredDates.unshift({ date: "3014-12-25 00:00:00", reminder: "0", date_show: 'New General', stock: 0 });
          this.new_expiredDates.unshift({ date: "", reminder: "", date_show: 'New Expired Date And Reminder', stock: 0 });

          for (let item of this.new_expiredDates) {
            if (item.date_show == 'General') {
              this.new_expiredDates.splice(1, 1);
            }
          }

        }
      } catch (e) {
        //error
        console.log(e);
      }

    }

  }

  expiredDatesChange() {
    this.ModalFormInventory.patchValue({ stock: this.expiredDates[this.expired_dates].stock });
  }

  new_expiredDatesChange() {
    if (this.new_expiredDates[this.new_expired_dates]) {
      this.ModalFormInventory.patchValue({ new_stock: this.new_expiredDates[this.new_expired_dates].stock });
    }

    if (this.new_expired_dates != 0 || !this.ModalFormInventory.value.newExpired) {
      this.disableInput.new_expired_date = true;
      this.disableInput.new_reminder_expired_date = true;
    } else {
      this.disableInput.new_expired_date = false;
      this.disableInput.new_reminder_expired_date = false;
    }
  }

  newExpiredChange(item) {
    if (!item) {
      this.disableInput.new_expired_dates = true;
    } else {
      this.disableInput.new_expired_dates = false;
    }
    this.new_expired_dates = 0;
    this.new_expiredDatesChange();
  }

  deleteDetail(item) {
    if (confirm("Are you sure to delete this data?")) {
      this.transferinventories.splice(this.transferinventories.indexOf(item), 1);
    }
  }

}
