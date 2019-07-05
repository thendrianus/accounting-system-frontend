import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'bom',
  templateUrl: './bom.html',
})
export class Bom {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  @ViewChild('childModal3') public childModal3: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  currentUser: any = { employee_job_id: 0 };
  inputHideAction: boolean = true;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formBom;

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
  moneyOption1 = {
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

  disableInput: any = {}

  _formBom = { bom_id: '', bom_inventory: [], bom_cost: [], bom_code: '', bom: '', quantity: 1, uom: '', min_quantity: 1, inventory_id: '', total_cost: 0, description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  _ModalformBomInventory = { bom_inventory_id: '', standard_inventory_detail_id: '', inventory: '', quantity: 1, uom: '', currency_id: '', cost: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  _ModalformBomCost = { bom_cost_id: '', standard_cost_detail_id: '', conversion_cost: '', quantity: 1, uom: '', currency_id: '', cost: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formBom = this.formBuilder.group({ //sssss
      bom_id: '',
      bom_inventory: [],
      bom_cost: [],
      bom_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      bom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      min_quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      inventory_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      total_cost: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.ModalformBomInventory = this.formBuilder.group({ //sssss
      bom_inventory_id: '',
      standard_inventory_detail_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      inventory: '',
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      currency_id: '',
      cost: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.ModalformBomCost = this.formBuilder.group({ //sssss
      bom_cost_id: '',
      standard_cost_detail_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      conversion_cost: '',
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      currency_id: '',
      cost: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formBom');
    console.log(this.formBom);
    console.log('this.ModalformBomInventory');
    console.log(this.ModalformBomInventory);
    console.log('this.ModalformBomCost');
    console.log(this.ModalformBomCost);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "BOM", "_code": "BOM Code", "_titleModal1": "Title Modal", "_titleModal2": "Title Modal", "_titleModal3": "Title Modal", "ph_bom_code": "BOM Code", "ph_bom": "BOM", "ph_quantity": "Quantity", "ph_min_quantity": "Min Quantity", "ph_total_cost": "Total Cost", "ph_description": "Description", "ph_quantityModal1": "Quantity", "ph_descriptionModal1": "Description", "ph_costModal1": "Cost", "ph_quantityModal3": "Quantity", "ph_descriptionModal3": "Description", "ph_costModal3": "Cost", "at_bom_code": "BOM Code", "at_name": "Name", "at_quantity": "Quantity", "at_uom": "UOM", "at_standardInventoryCode": "Standard Inventory", "at_inventory": "Inventory", "at_totalCost": "Total Cost", "at_description": "Description", "at_inventoryModal1": "Inventory", "at_quantityModal1": "Quantity", "at_descriptionModal1": "Description", "at_uomModal1": "UOM", "at_costModal1": "Cost", "at_cost_idModal3": "Standard Cost", "at_quantityModal3": "Quantity", "at_descriptionModal3": "Description", "at_uomModal3": "UOM", "at_costModal3": "Cost", "btn_add": "Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear", "btn_addInventory": "Add Inventory", "btn_addCost": "Add Cost", "btn_closeModal1": "Close", "btn_addModal1": "Add", "btn_updateModal1": "Update", "btn_closeModal2": "Close", "btn_closeModal3": "Close", "btn_addModal3": "Add", "btn_updateModal3": "Update", "th_action": "Action", "th_no": "No", "th_inventory": "Inventory", "th_new_inventory": "New Inventory", "th_actionTbl2": "Action", "th_noTbl2": "No", "th_costTbl2": "Cost", "th_newCostTbl2": "New Cost", "th_bom_codeTbl3": "BOM Code", "th_bomTbl3": "BOM", "th_quantityTbl3": "Quantity", "th_min_quantityTbl3": "Min Quantity", "th_total_costTbl3": "Total Cost", "th_descriptionTbl3": "Description", "td_edit": "Edit", "td_editTbl2": "Edit", "td_detailTbl3": "Detail" };

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
    this.httpService.getTranslate('26').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.bom_code = true;
          this.disableInput.total_cost = true;
          this.disableInput.uom = true;
          this.disableInput.uom = true;
          this.disableInput.cost = true;
          this.disableInput.cost = true;
          this.disableInput.uom = true;
          this.getInventory();
          this.getStandardInventory();
          this.getStandardCost();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  bomParse: any = {};

  formBomSubmit() {

    this.bomParse = this.copying(this.formBom.getRawValue());
    this.bomParse.update_by = this.httpService.currentUser.employee_id;
    this.bomParse.update_datetime = new Date();

    this.bomParse.bom_inventory = this.modalStandardInventorys;
    this.bomParse.bom_cost = this.modalStandardCosts;

    if (this.bomParse.bom_id == '') {
      this.bomParse.create_by = this.httpService.currentUser.employee_id;
      this.bomParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/bom', this.bomParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formBom.patchValue({
              ...this.copying(this.bomParse),
              bom_id: value.data.bom_id,
              bom_code: value.data.bom_code
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
      this.formBomUpdate();
    }

  }

  formBomUpdate() {

    this.httpService.http_api_put('manufacture/bom', this.bomParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formBom.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formBom.patchValue({ ...this.copying(this.bomParse) });
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  BomDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formBom.patchValue({ is_active: 0 });
      this.formBomUpdate();
    }
  }


  getBomList() {
    this.httpService.http_api_post('manufacture/bom/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.bom);
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
        deleteButtonContent: `${this.gen.td_detailTbl3}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        bom_code: {
          title: this.gen.th_bom_codeTbl3,
          type: 'string',
          editable: false,
          show: 1
        },
        bom: {
          title: this.gen.th_bomTbl3,
          type: 'string',
          editable: false,
          show: 1
        },
        quantity: {
          title: this.gen.th_quantityTbl3,
          type: 'string',
          editable: false,
          show: 1
        },
        min_quantity: {
          title: this.gen.th_min_quantityTbl3,
          type: 'string',
          editable: false,
          show: 1
        },
        total_cost: {
          title: this.gen.th_total_costTbl3,
          valuePrepareFunction: (value) => { return value === 'Total' ? value : Intl.NumberFormat('en-US').format(value) },
          type: 'string',
          editable: false,
          show: 1
        },
        description: {
          title: this.gen.th_descriptionTbl3,
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
    event.data.inventory_id = "" + event.data.inventory_id + "";
    this.formBom.patchValue({ ...event.data });
    this.getStandardInventoryDetail();
    this.getStandardCostDetail();
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
    this.modalStandardCosts = JSON.parse("[]");

    this.formBom.reset(this._formBom);
    this.ModalformBomInventory.reset(this._ModalformBomInventory);
    this.ModalformBomCost.reset(this._ModalformBomCost);
  }

  edit() {

  }

  modalShow(item) {

    this.ModalHeader = 'Bom Detail';

    if (item == '') {

      this.ModalformBomInventory.reset({
        ...this._ModalformBomInventory,
        bom_id: this.formBom.value.bom_id
      });

      this.ModalHeader = this.gen._titleModal1;
    } else {
      item.standard_inventory_detail_id = "" + item.standard_inventory_detail_id + "";
      this.ModalformBomInventory.patchValue({
        modalBomInventory: item
      })
      this.ModalHeader = this.gen._titleModal12;
    }

    this.childModal.show();
  }

  modalShow3(item) {

    this.ModalHeader = 'Bom Detail';

    if (item == '') {

      this.ModalformBomCost.reset({
        ...this._ModalformBomCost,
        bom_id: this.formBom.value.bom_id
      });

      this.ModalHeader3 = this.gen._titleModal32;
    } else {
      item.standard_cost_detail_id = "" + item.standard_cost_detail_id + "";
      this.ModalformBomCost.patchValue({ ...item });
      this.ModalHeader3 = this.gen._titleModal32;
    }

    this.childModal3.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalHide3() {
    this.childModal3.hide();
  }

  modalShow2() {
    this.getBomList();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {

    this.modalHide();
  }

  modalOut3() {

    this.modalHide3();
  }


  public ModalHeader: string;
  public ModalHeader3: string;

  ModalformBomInventory;
  ModalformBomCost;
  modalStandardInventorys: any = [];
  modalStandardCosts: any = [];

  getStandardInventoryDetail() {
    this.httpService.http_api_post('manufacture/bom/inventory', { bom_id: this.formBom.value.bom_id }).subscribe((value) => {

      if (value.success) {
        this.modalStandardInventorys = value.data.bom_inventory;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getStandardCostDetail() {
    this.httpService.http_api_post('manufacture/bom/cost', { bom_id: this.formBom.value.bom_id }).subscribe((value) => {

      if (value.success) {
        this.modalStandardCosts = value.data.bom_cost;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalFormSubmitInventory() {

    this.ModalformBomInventory.patchValue({
      create_by: this.httpService.currentUser.employee_id,
      create_datetime: new Date()
    })

    if (this.ModalformBomInventory.value.bom_inventory_id == '') {
      this.modalStandardInventorys.push(this.copying(this.ModalformBomInventory.getRawValue()));
    }
    this.countTotalCost();
    this.modalOut();
  }

  ModalFormSubmitCost() {
    this.ModalformBomCost.patchValue({
      create_by: this.httpService.currentUser.employee_id,
      create_datetime: new Date()
    })

    if (this.ModalformBomCost.value.bom_cost_id == '') {
      this.modalStandardCosts.push(this.copying(this.ModalformBomCost.getRawValue()));
    }

    this.countTotalCost();
    this.modalOut3();
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
    this.formBom.patchValue({
      uom: event.uom1,
      currency_id: event.currency_id
    })
  }

  standardInventoryData: any = [];
  getStandardInventory() {
    this.standardInventoryData = JSON.parse("[]");
    this.httpService.http_api_get('manufacture/standard_inventory/detail/').subscribe((value) => {
      if (value.success) {
        this.standardInventoryData = value.data.standard_inventory_detail;

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  standardCostData: any = [];
  getStandardCost() {
    this.standardCostData = JSON.parse("[]");
    this.httpService.http_api_get('manufacture/standard_cost/detail/').subscribe((value) => {
      if (value.success) {
        this.standardCostData = value.data.standard_cost_detail;

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  modalStandardInventoryIdChange(event) {

    this.ModalformBomInventory.patchValue({
      cost: event.new_cost,
      uom: event.uom,
      inventory: event.inventory,
      currency_id: event.currency_id,
    })
    this.moneyOption.prefix = event.currency_id + '. ';

  }

  modalStandardCostIdChange(event) {

    this.ModalformBomCost.patchValue({
      cost: event.new_cost,
      uom: event.uom,
      inventory: event.inventory,
      currency_id: event.currency_id,
    })

    this.moneyOption1.prefix = event.currency_id + '. ';

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

  countTotalCost() {

    this.formBom.patchValue({ total_cost: 0 });

    for (let item of this.modalStandardCosts) {
      this.formBom.patchValue({ total_cost: this.formBom.value.total_cost += item.cost * item.quantity });
    }

    for (let item of this.modalStandardInventorys) {
      this.formBom.patchValue({
        total_cost: this.formBom.value.total_cost + item.cost * item.quantity
      })
    }
  }

}
