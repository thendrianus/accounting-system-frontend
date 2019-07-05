import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'standard_inventory',
  templateUrl: './standard_inventory.html',
})
export class Standard_inventory {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;
  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formStandard_inventory;

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

  _formStandard_inventory = { standard_inventory_id: '', standard_inventory_detail: [], standard_inventory_code: '', effective_date: moment().format("YYYY-MM-DD"), description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  _ModalformStandard_inventory = { standard_inventory_detail_id: '', standard_inventory_id: '', inventory_id: '', inventory: '', new_cost: '', uom: '', currency_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, is_on_detail: 0 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formStandard_inventory = this.formBuilder.group({ //sssss
      standard_inventory_id: '',
      standard_inventory_detail: [],
      standard_inventory_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      effective_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.ModalformStandard_inventory = this.formBuilder.group({ //sssss
      standard_inventory_detail_id: '',
      standard_inventory_id: '',
      inventory_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      inventory: '',
      new_cost: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      currency_id: '',
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      is_on_detail: 0
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formStandard_inventory');
    console.log(this.formStandard_inventory);
    console.log('this.ModalformStandard_inventory');
    console.log(this.ModalformStandard_inventory);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Standard Inventory", "_code": "Standard Inventory Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "ph_code": "Standard Inventory Code", "ph_description": "Description", "ph_new_costM1": "New Cost", "ph_descriptionM1": "Description", "at_code": "Standard Inventory Code", "at_date": "Date", "at_description": "Description", "at_inventoryM1": " Inventory", "at_new_costM1": "New Cost", "at_uomM1": "UOM", "at_descriptionM1": "Description", "btn_add": " Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_add_inventory": "Add Item", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_updateM1": "Update", "btn_closeM2": "Close", "th_action": "Action", "th_no": "No", "th_inventory": "Inventory", "th_new_cost": "New Cost", "th_codeTbl2": "", "th_efective_dateTbl2": "Efective Date", "th_descriptionTbl2": "Description", "td_edit": "Edit", "td_detailTbl2": "Detail" };

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
    this.httpService.getTranslate('31').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;

          this.disableInput.standard_inventory_code = true;
          this.disableInput.uom = true;
          this.getInventory();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  standard_inventoryParse: any = {};

  formStandard_inventorySubmit() {

    this.standard_inventoryParse = this.copying(this.formStandard_inventory.getRawValue());
    this.standard_inventoryParse.update_by = this.httpService.currentUser.employee_id;
    this.standard_inventoryParse.update_datetime = new Date();

    this.standard_inventoryParse.standard_inventory_detail = this.modalStandardInventorys;

    if (this.standard_inventoryParse.standard_inventory_id == '') {
      this.standard_inventoryParse.create_by = this.httpService.currentUser.employee_id;
      this.standard_inventoryParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/standard_inventory', this.standard_inventoryParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setstandard_inventory(this.standard_inventoryParse);
            this.formStandard_inventory.patchValue({
              standard_inventory_id: value.data.standard_inventory_id,
              standard_inventory_code: value.data.standard_inventory_code
            })

            this.getStandardInventoryDetail();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.formStandard_inventoryUpdate();
    }

  }

  formStandard_inventoryUpdate() {

    this.httpService.http_api_put('manufacture/standard_inventory', this.standard_inventoryParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formStandard_inventory.value.is_active == 0) {
            this.clearAll();
          } else {
            this.setstandard_inventory(this.standard_inventoryParse);
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  Standard_inventoryDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formStandard_inventory.patchValue({ is_active: 0 });
      this.formStandard_inventoryUpdate();
    }
  }


  getStandard_inventoryList() {
    this.httpService.http_api_post('manufacture/standard_inventory/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.standard_inventory);
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
        deleteButtonContent: `${this.gen.td_detailTbl2}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        standard_inventory_code: {
          title: this.gen.th_codeTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        effective_date_show: {
          title: this.gen.th_efective_dateTbl2,
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
    this.setstandard_inventory(event.data);
    this.getStandardInventoryDetail();
    this.modalHide2();
  }

  outGllist() {
    this.inputGllist = Math.random().toString();
  }

  outputClearall: string = '';
  clearAll() {
    this.outputClearall = Math.random().toString();
    this.glTransactionGlLinkId = '';
    this.modalStandardInventorys = JSON.parse("[]");
    this.setstandard_inventory(false);
    this.ModalformStandard_inventory.reset(this._ModalformStandard_inventory);
  }

  edit() {

  }

  modalShow(item) {

    this.ModalHeader = 'Standard_inventory Detail';

    if (item == '') {

      this.ModalformStandard_inventory.reset({
        ...this._ModalformStandard_inventory,
        standard_inventory_id: this.formStandard_inventory.value.standard_inventory_id
      });
      this.ModalHeader = this.gen._titleM1;

    } else {
      item.inventory_id = "" + item.inventory_id + "";
      this.ModalformStandard_inventory.patchValue(item);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2() {
    this.getStandard_inventoryList();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {

    this.modalHide();
  }

  public ModalHeader: string;

  ModalformStandard_inventory;
  modalStandardInventorys: any = [];

  getStandardInventoryDetail() {
    this.httpService.http_api_post('manufacture/standard_inventory/detail', { standard_inventory_id: this.formStandard_inventory.value.standard_inventory_id }).subscribe((value) => {

      if (value.success) {
        this.modalStandardInventorys = value.data.standard_inventory_detail;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalFormSubmit() {
    this.ModalformStandard_inventory.patchValue({
      create_by: this.httpService.currentUser.employee_id,
      create_datetime: new Date()
    })
    if (this.ModalformStandard_inventory.value.standard_inventory_detail_id == '' && this.ModalformStandard_inventory.value.is_on_detail == 0) {
      this.ModalformStandard_inventory.patchValue({
        is_on_detail: 1
      })


      this.modalStandardInventorys.push(this.copying(this.ModalformStandard_inventory.getRawValue()));
    } else {

      for (let i in this.modalStandardInventorys) {

        if (this.modalStandardInventorys[i].inventory_id == this.modalStandardInventorys.inventory_id) {
          this.modalStandardInventorys[i] = this.ModalformStandard_inventory.value;
        }

      }
    }

    this.modalOut();

  }

  setstandard_inventory(data) {
    if (data) {
      data.effective_date = moment(data.effective_date).format("YYYY-MM-DD")
      this.formStandard_inventory.patchValue(this.copying(data));
    } else {
      this.formStandard_inventory.reset(this._formStandard_inventory)
    }
  }

  inventoryData: any = [];
  getInventory() {
    this.inventoryData = JSON.parse("[]");
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 0 }).subscribe((value) => {
      if (value.success) {

        this.inventoryData = value.data.inventory;

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  modalInventoryIdChange(event) {

    this.ModalformStandard_inventory.patchValue({
      new_cost: event.hpp,
      uom: event.uom1,
      inventory: event.inventory,
      currency_id: event.currency_id,
    })

    this.moneyOption.prefix = event.currency_id + '. ';

  }

  standardCostDetailDelete(index) {

    if (confirm("Are you sure to delete this?")) {
      this.modalStandardInventorys.splice(index, 1);
    }

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
