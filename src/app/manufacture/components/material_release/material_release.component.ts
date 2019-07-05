import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'material_release',
  templateUrl: './material_release.html',
})
export class Material_release {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;
  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formMaterial_release;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formMaterial_release = { material_release_code: '', release_date: moment().format("YYYY-MM-DD"), work_order_id: '', warehouse_id: '', description: '-', }
  _ModalformMaterial_release = { inventory_id: '', quantity: '', uom: '', description: '-', }

  material_release: any = this.copying(this._formMaterial_release);

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formMaterial_release = this.formBuilder.group({
      material_release_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      release_date: moment().format("YYYY-MM-DD"),
      work_order_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
    });

    this.ModalformMaterial_release = this.formBuilder.group({
      inventory_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      quantity: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
    });

  }

  printConsoleForm() {
    console.log('this.formMaterial_release');
    console.log(this.formMaterial_release);
    console.log('this.ModalformMaterial_release');
    console.log(this.ModalformMaterial_release);
    console.log('this.material_release');
    console.log(this.material_release);
    console.log('this.modalMaterial_release');
    console.log(this.modalMaterial_release);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Material Release", "_code": "Material Release Code", "_titleModal2": "Title Modal", "_titleModal1": "Title Modal", "ph_material_release Code": "Material Release Code", "ph_description": "Description", "ph_quantityM1": "Quantity", "ph_descriptionM1": "Description", "at_code": "Material Release Code", "at_date": " Date", "at_from_warehouse": "From Warehouse", "at_work_order": "Work Order", "at_description": "Description", "at_inventoryM1": " Inventory", "at_quantityM1": "Quantity", "at_uomM1": "UOM", "at_descriptionM1": "Description", "btn_add": "Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear", "btn_add_inventory": "Add Item", "btn_closeM1": "Close", "btn_addM1": " Add", "btn_updateM1": "Update", "btn_closeM2": "Close", "th_action": "Action", "th_no": "No", "th_inventory": "New Item", "th_codeTbl2": "Material Release Code", "th_release_dateTbl2": "Release Date", "th_descriptionTbl2": "Description", "td_edit": "Edit", "td_detailTbl2": "Detail" };

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
    this.httpService.getTranslate('28').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.material_release_code = true;
          this.disableInput.uom = true;

          this.getWarehouse();
          this.getWork_order();

        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  material_releaseParse: any = {};

  formMaterial_releaseSubmit() {

    this.material_release = { ...this.material_release, ...this.formMaterial_release.getRawValue() }
    this.material_releaseParse = this.copying(this.material_release);
    this.material_releaseParse.update_by = this.httpService.currentUser.employee_id;
    this.material_releaseParse.update_datetime = new Date();

    this.material_releaseParse.material_release_detail = this.modalStandardInventorys;

    if (this.material_releaseParse.material_release_id == '') {
      this.material_releaseParse.create_by = this.httpService.currentUser.employee_id;
      this.material_releaseParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/material_release', this.material_releaseParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setmaterial_release(this.material_releaseParse);
            this.material_release.material_release_id = value.data.material_release_id;
            this.material_release.material_release_code = value.data.material_release_code;
            this.getStandardInventoryDetail();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.formMaterial_releaseUpdate();
    }

  }

  formMaterial_releaseUpdate() {

    this.httpService.http_api_put('manufacture/material_release', this.material_releaseParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.material_release.is_active == 0) {
            this.clearAll();
          } else {
            this.setmaterial_release(this.material_releaseParse);
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  Material_releaseDelete() {

    if (confirm("Are you sure to delete this data?")) {
      this.material_release.is_active = 0;
      this.formMaterial_releaseUpdate();
    }

  }


  getMaterial_releaseList() {
    this.httpService.http_api_post('manufacture/material_release/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.material_release);
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
        material_release_code: {
          title: this.gen.tblheader,
          type: 'string',
          editable: false,
          show: 1
        },
        release_date_show: {
          title: this.gen.tblheader,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.tblheader,
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
    this.setmaterial_release(event.data);
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
    this.setmaterial_release(this._formMaterial_release);
    this.modalMaterial_release = this.copying(this._ModalformMaterial_release);
    this.materialReleaseChange();
  }

  edit() {

  }

  materialReleaseChange() {
    if (this.material_release.material_release_id != '') {
      this.disableInput.warehouse_id = true;
      this.disableInput.work_order_id = true;
    } else {
      this.disableInput.warehouse_id = false;
      this.disableInput.work_order_id = false;
    }
  }

  modalShow(item) {

    this.ModalHeader = 'Material_release Detail';

    if (item == '') {

      this.modalMaterial_release = this.copying(this._ModalformMaterial_release);
      this.materialReleaseChange();

      this.modalMaterial_release.material_release_id = this.material_release.material_release_id;
      this.ModalHeader = this.gen._titleModal2;

    } else {
      this.modalMaterial_release = item;
      this.materialReleaseChange();
      this.ModalHeader = this.gen._titleModal22;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2() {
    this.getMaterial_releaseList();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {

    this.modalHide();
  }



  public modalMaterial_release: any = this.copying(this._ModalformMaterial_release);

  public ModalHeader: string;

  ModalformMaterial_release;
  modalStandardInventorys: any = [];

  getStandardInventoryDetail() {
    this.httpService.http_api_post('manufacture/material_release/detail', { material_release_id: this.material_release.material_release_id }).subscribe((value) => {

      if (value.success) {
        this.modalStandardInventorys = value.data.material_release_detail;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalFormSubmit() {

    this.modalMaterial_release = { ...this.modalMaterial_release, ...this.ModalformMaterial_release.value }
    if (this.modalMaterial_release.material_release_detail_id == '') {
      this.modalMaterial_release.create_by = this.httpService.currentUser.employee_id;
      this.modalMaterial_release.create_datetime = new Date();
      this.modalStandardInventorys.push(this.copying(this.modalMaterial_release));
    } else {
      this.modalMaterial_release.update_by = this.httpService.currentUser.employee_id;
      this.modalMaterial_release.update_datetime = new Date();
    }

    this.modalOut();

  }

  setmaterial_release(data) {
    data.release_date = moment(data.release_date).format("YYYY-MM-DD")
    data.work_order_id = "" + data.work_order_id + "";
    this.material_release = this.copying(data);
    this.materialReleaseChange();
  }

  inventoryData: any = [];
  getInventory(id) {
    this.inventoryData = JSON.parse("[]");
    this.httpService.http_api_put('manufacture/material_release/select', { work_order_id: id }).subscribe((value) => {
      if (value.success) {

        this.inventoryData = value.data.inventory;

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  modalInventoryIdChange(event) {
    this.modalMaterial_release.uom = event.uom1;
    this.modalMaterial_release.inventory = event.inventory;
    this.modalMaterial_release.stock = event.quantity;

    if (this.material_release.material_release.length > 0) {
      for (let item of this.material_release.material_release) {
        if (item.inventory_id == event.inventory_id) {
          this.modalMaterial_release.stock = event.quantity - item.quantity;
        }
      }
    }
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

  work_orderData: any = [];
  getWork_order() {
    this.httpService.http_api_post('manufacture/work_order/select', { is_use: 1 }).subscribe((value) => {

      if (value.success) {
        this.work_orderData = value.data.work_order;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
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

  workOrderChange(event) {
    this.getInventory(event.value);
    this.material_release.material_release = JSON.parse("[]");

    try {
      this.material_release.material_release = JSON.parse(event.material_release);
    } catch (e) {
      //error
      console.log(e);
    }

  }

}
