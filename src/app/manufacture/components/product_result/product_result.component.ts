import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'product_result',
  templateUrl: './product_result.html',
})
export class Product_result {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  currentUser: any = { employee_job_id: 0 };
  inputHideAction: boolean = true;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formProduct_result;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formProduct_result = { product_result_id: '', product_result_detail: [], product_result_code: '', release_date: moment().format("YYYY-MM-DD"), work_order_id: '', warehouse_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  _ModalformProduct_result = { product_result_detail_id: '', product_result_id: '', inventory_id: '', inventory: '', quantity: '', uom: '', description: '-', stock: 0, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formProduct_result = this.formBuilder.group({ //sssss
      product_result_id: '',
      product_result_detail: [],
      product_result_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      release_date: moment().format("YYYY-MM-DD"),
      work_order_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.ModalformProduct_result = this.formBuilder.group({ //sssss
      product_result_detail_id: '',
      product_result_id: '',
      inventory_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      inventory: '',
      quantity: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      stock: 0,
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
    console.log('this.formProduct_result');
    console.log(this.formProduct_result);
    console.log('this.ModalformProduct_result');
    console.log(this.ModalformProduct_result);
  }


  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Product Result", "_code": "Product Result Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "ph_code": "", "ph_description": "Description", "ph_quantityM1": "Quantity", "ph_descriptionM1": "Description", "at_code": "", "at_date": "Date", "at_from_warehouse": "From Warehouse", "at_new_order": "New Order", "at_description": "Description", "at_inventoryM1": " Inventory", "at_quantityM1": "Quantity", "at_uomM1": "UOM", "at_descriptionM1": "Description", "btn_add": " Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_add_inventory": "Add Item", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_updateM1": "Update", "btn_closeM2": "Close", "th_action": "Action", "th_no": "No", "th_inventory": "Inventory", "th_new_cost": "New Cost", "th_codeTbl2": "", "th_release_dateTbl2": "Release Date", "th_descriptionTbl2": "Description", "td_edit": "Edit", "td_detailTbl2": "Detail" };

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
    this.httpService.getTranslate('29').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.product_result_code = true;
          this.disableInput.uom = true;

          this.getWarehouse();
          this.getWork_order();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  product_resultParse: any = {};

  formProduct_resultSubmit() {

    this.product_resultParse = this.copying(this.formProduct_result.getRawValue());
    this.product_resultParse.update_by = this.httpService.currentUser.employee_id;
    this.product_resultParse.update_datetime = new Date();

    this.product_resultParse.product_result_detail = this.modalStandardInventorys;

    if (this.product_resultParse.product_result_id == '') {
      this.product_resultParse.create_by = this.httpService.currentUser.employee_id;
      this.product_resultParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/product_result', this.product_resultParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setproduct_result(this.product_resultParse);
            this.formProduct_result.patchValue({
              product_result_id: value.data.product_result_id,
              product_result_code: value.data.product_result_code,
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
      this.formProduct_resultUpdate();
    }

  }

  formProduct_resultUpdate() {

    this.httpService.http_api_put('manufacture/product_result', this.product_resultParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formProduct_result.value.is_active == 0) {
            this.clearAll();
          } else {
            this.setproduct_result(this.product_resultParse);
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  Product_resultDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formProduct_result.patchValue({ is_active: 0 });
      this.formProduct_resultUpdate();
    }
  }


  getProduct_resultList() {
    this.httpService.http_api_post('manufacture/product_result/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.product_result);
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
        product_result_code: {
          title: this.gen.th_codeTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        release_date_show: {
          title: this.gen.th_release_dateTbl2,
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
    this.setproduct_result(event.data);
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
    this.setproduct_result(false);
    this.ModalformProduct_result.reset(this._ModalformProduct_result);
    this.prodycResultChange();
  }

  edit() {

  }

  modalShow(item) {

    this.ModalHeader = 'Product_result Detail';

    if (item == '') {

      this.ModalformProduct_result.reset(this._ModalformProduct_result);
      this.prodycResultChange();
      this.ModalformProduct_result.patchValue({ product_result_id: this.formProduct_result.value.product_result_id });
      this.ModalHeader = this.gen._titleM1;

    } else {
      this.ModalformProduct_result.patchValue(item);
      this.prodycResultChange();
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2() {
    this.getProduct_resultList();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {

    this.modalHide();
  }

  public ModalHeader: string;

  ModalformProduct_result;
  modalStandardInventorys: any = [];

  getStandardInventoryDetail() {
    this.httpService.http_api_post('manufacture/product_result/detail', { product_result_id: this.formProduct_result.value.product_result_id }).subscribe((value) => {

      if (value.success) {
        this.modalStandardInventorys = value.data.product_result_detail;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalFormSubmit() {

    this.ModalformProduct_result.patchValue({
      create_by: this.httpService.currentUser.employee_id,
      create_datetime: new Date(),
    })

    if (this.ModalformProduct_result.value.product_result_detail_id == '') {
      this.modalStandardInventorys.push(this.copying(this.ModalformProduct_result.getRawValue()));
    }

    this.modalOut();

  }

  setproduct_result(data) {
    if (data) {
      data.work_order_id = "" + data.work_order_id + "";
      data.release_date = moment(data.release_date).format("YYYY-MM-DD")
      this.formProduct_result.patchValue({ ...this.copying(data) });
    } else {
      this.formProduct_result.reset(this._formProduct_result)
    }

    this.prodycResultChange();

  }

  inventoryData: any = [];
  getInventory(id) {
    this.inventoryData = JSON.parse("[]");
    this.httpService.http_api_put('manufacture/product_result/select', { work_order_id: id }).subscribe((value) => {
      if (value.success) {

        this.inventoryData = value.data.inventory;

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  modalInventoryIdChange(event) {

    this.ModalformProduct_result.patchValue({
      uom: event.uom1,
      inventory: event.inventory,
      stock: event.quantity
    })

    if (this.ModalformProduct_result.value.product_result.length > 0) {
      for (let item of this.ModalformProduct_result.value.product_result) {
        if (item.inventory_id == event.inventory_id) {
          this.ModalformProduct_result.patchValue({ stock: event.quantity - item.quantity });
        }
      }
    }

  }

  uomData: any = [];
  getUomData() {
    this.httpService.http_api_post('apps/uom/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.uomData = value.data.uom;
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
    this.ModalformProduct_result.patchValue({ product_result: [] });

    try {
      this.ModalformProduct_result.patchValue({ product_result: JSON.parse(event.product_result) });
    } catch (e) {
      //error
      console.log(e);
    }

  }

  prodycResultChange() {
    if (this.formProduct_result.value.product_result_id != '') {
      this.disableInput.warehouse_id = true;
      this.disableInput.work_order_id = true;
    } else {
      this.disableInput.warehouse_id = false;
      this.disableInput.work_order_id = false;
    }
  }

}
