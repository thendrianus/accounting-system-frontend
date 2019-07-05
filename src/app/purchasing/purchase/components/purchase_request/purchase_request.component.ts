import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'purchase_request',
  styleUrls: ['./purchase_request.scss'],
  templateUrl: './purchase_request.html',
})
export class Purchase_request {

  purchase_requestsDetail: any = [];
  formPurchase_request;
  formPurchase_requestDetail;
  formTerm

  public minDate: Date = void 0;
  public dateDisabled: { date: Date, mode: string }[];
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formPurchase_request = { purchase_request_id: '', purchase_request_detail: [], purchase_request_code: '', businesspartner_id: '', branch_id: '', warehouse_id: '', transaction_date: moment().format("YYYY-MM-DD"), description: '-', purchase_category_id: 1, purchase_link_id: 0, purchase_status_id: 1, update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, oripurchase_status_id: 1, }

  disableInput: any = {}

  _formPurchase_requestDetail = { purchase_request_detail_id: '', purchase_request_id: '', inventory_id: '', inventory_code: '', name: '', warehouse_id: '', quantity: 1, quantityeqv: 1, uom_order: 1, uom_label: '', row_order: 1, row_label: '', inventory_label: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, uom1: '', uom2: '', uom3: '', uom2equal: 1, uom3equal: 1, stock: 0 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formPurchase_request = this.formBuilder.group({ //sssss
      purchase_request_id: '',
      purchase_request_detail: [],
      purchase_request_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      purchase_category_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      purchase_link_id: 0,
      purchase_status_id: 1,
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      oripurchase_status_id: 1,
    });

    this.formPurchase_requestDetail = this.formBuilder.group({ //sssss
      purchase_request_detail_id: '',
      purchase_request_id: '',
      inventory_id: '',
      inventory_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      quantityeqv: 1,
      uom_order: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom_label: '',
      row_order: 1,
      row_label: '',
      inventory_label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      uom1: '',
      uom2: '',
      uom3: '',
      uom2equal: 1,
      uom3equal: 1,
      stock: 0
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formPurchase_request');
    console.log(this.formPurchase_request);
    console.log('this.formPurchase_requestDetail');
    console.log(this.formPurchase_requestDetail);
  }

  formPurchase_requestField = [{ name: "_businesspartner_id" }, { name: "_branch_id" }, { name: "_warehouse_id" }, { name: "_purchase_category_id" }, { name: "_description" }, { name: "_transaction_date" }];

  formButton = [{ name: 'New Item', show: true }];

  disabledSpecialFormField() {
    this.disableInput.inventory_code = true;
    this.disableInput.name = true;
    this.disableInput.purchase_request_code = true;
  }

  formFieldDisabledEnabled(io) {
    if (io == 0) {
      for (let e of this.formPurchase_requestField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formButton) {
        e.show = false;
      }
    } else {
      for (let e of this.formPurchase_requestField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formButton) {
        e.show = true;
      }
    }

    if (this.formPurchase_request.value.purchase_request_id == "") {
      this.disableInput.purchase_request_code = false;
    } else {
      this.disableInput.purchase_request_code = true;
    }

  }

  gen: any = { "app_component_id": 0, "_title": "Purchase Request", "_code": "Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "_titleM3": "Title Modal", "ph_code": "Code", "ph_description": "Description", "ph_inventory_codeM1": "Inventory Code", "ph_nameM1": "Name", "ph_quantityM1": "Quantity", "ph_descriptionM1": "Description", "at_code": "Code", "at_category": "Category", "at_customer": "Customer", "at_date": "Date", "at_branch": "Branch", "at_warehouse": "Warehouse", "at_description": "Description", "at_inventory_codeM1": "Inventory Code", "at_nameM1": "Name", "at_warehouseM1": "Warehouse", "at_quantityM1": "Quantity", "at_uomM1": "UOM", "at_description2": "Description", "btn_add": " Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_edit_transaction": "Edit Transaction", "btn_new_item": "New Item", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_editM1": "Edit", "btn_closeM2": "Close", "btn_closeM3": "Close", "th_action": "Action", "th_inventory_code": "Inventory Code", "th_name": "Name", "th_quantity": "Quantity", "th_uom": "UOM", "th_total": "Total", "th_item": "Item", "th_codeTbl2": "Code", "th_nameTbl2": "Name", "th_brandTbl2": "Brand", "th_uomTbl2": "UOM", "th_stockTbl2": "Stock", "th_descriptionTbl2": "Description", "th_branchTbl3": "Branch", "th_codeTbl3": "Code", "th_dateTbl3": "Date", "th_customerTbl3": "Customer", "th_statusTbl3": "Status", "th_createByTbl3": "Created By", "td_selectTbl2": "Select", "td_refreshTbl2": "Refresh", "td_selectTbl3": "Select", "td_refreshTbl3": "Refresh" };

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
    this.httpService.getTranslate('37').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disabledSpecialFormField();

          this.getWarehouse();
          this.getBusinesspartner();
          this.getBranch();
          this.getPurchase_requestcategory();
          this.getPurchase_requestsStatus();

        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  setpurchase_request(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      // // data.businesspartner_id = "" + data.businesspartner_id + "";
      this.formPurchase_request.patchValue(this.copying(data));
    } else {
      this.formPurchase_request.reset(this._formPurchase_request)
    }
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  @ViewChild('childModal') public childModal: ModalDirective; // inventory search
  @ViewChild('childModal2') public childModal2: ModalDirective; // purchase_request detail form
  @ViewChild('childModal4') public childModal4: ModalDirective; //purchase_request search

  public ModalHeader: string;

  modalShow(item) {

    this.ModalHeader = 'Account Detail';

    if (item == '-') {
      this.ifModal2show = -1;
      this.modal2Out(this.source[item]);
      this.ModalHeader = this.gen._titleM1;
    } else {
      this.ifModal2show = item;
      this.modal2Out(this.purchase_requestsDetail[item]);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {

    if (this.ifModal2show == -1) {
      this.purchase_requestsDetail.push(this.copying(this.formPurchase_requestDetail.getRawValue()));
    } else {
      this.purchase_requestsDetail[this.ifModal2show] = this.copying(this.formPurchase_requestDetail.getRawValue());
    }
    this.formPurchase_requestDetail.reset(this._formPurchase_requestDetail)
    this.modalHide();
    this.count();

  }

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  
  mySettings() {
    return {
      actions: {
        delete: false,
        // add: false
      },
      mode: 'external',
      edit: {
        editButtonContent: `${this.gen.td_selectTbl2}`,
        confirmSave: true,
      },
      add: {
        addButtonContent: `${this.gen.td_refreshTbl2}`,
        confirmSave: true,
      },
      columns: this.httpService.generateng2columns({
        inventory_code: {
          title: this.gen.th_codeTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        name: {
          title: this.gen.th_nameTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        brand: {
          title: this.gen.th_brandTbl2,
          type: 'string',
          show: 1
        },
        stock: {
          title: this.gen.th_stockTbl2,
          type: 'string',
          show: 1
        },
        uom1: {
          title: this.gen.th_uomTbl2,
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

  edit() {

  }

  childModal2Refresh() {
    this.getInventoryList();
  }

  Modal2Header;
  ifModal2show = -1;
  modal2Show(item) {
    this.Modal2Header = 'Account Detail';

    if (item == '-') {
      this.ifModal2show = -1;
    } else {
      this.ifModal2show = item;
    }

    this.getInventoryList();

    this.childModal2.show();
  }

  modal2Hide() {
    this.childModal2.hide();
  }

  modal2Out(event) {

    for (let index = 0; index < this.purchase_requestsDetail.length; index++) {

      if (this.purchase_requestsDetail[index].inventory_id == event.inventory_id) {

        if (this.purchase_requestsDetail[index].is_active == 1) {
          this.ifModal2show = index;
        } else {
          this.ifModal2show = -1;
        }
      }

    }

    if (this.ifModal2show == -1) {
      this.formPurchase_requestDetail.reset(this._formPurchase_requestDetail)
    } else {
      this.formPurchase_requestDetail.patchValue(this.copying(this.purchase_requestsDetail[this.ifModal2show]));
    }

    if (this.formPurchase_requestDetail.value.inventory_id != event.inventory_id) {

      this.formPurchase_requestDetail.patchValue({
        uom_order: 1,
        uom_label: event.uom1,

        uom1: event.uom1,
        uom2: event.uom2,
        uom3: event.uom3,

        uom2equal: event.uom2equal,
        uom3equal: event.uom3equal,

        stock: event.stock,

        inventory_id: event.inventory_id,
        inventory_code: event.inventory_code,
        name: event.name,
      })

      if (!this.formPurchase_requestDetail.value.inventory_label) {
        this.formPurchase_requestDetail.patchValue({ inventory_label: event.name });
      }
    }

    this.childModal.show();
    this.modal2Hide();

  }

  getInventoryList() {
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 2 }).subscribe((value) => {
      ;
      if (value.success) {
        this.source.load(value.data.inventory);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  warehouseChange() {
    this._formPurchase_requestDetail.warehouse_id = this.formPurchase_request.value.warehouse_id;
  }

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        if (value.data.warehouse.length > 0) {
          this._formPurchase_request.warehouse_id = value.data.warehouse[0].warehouse_id;
          this.formPurchase_request.patchValue({ warehouse_id: value.data.warehouse[0].warehouse_id });
          this._formPurchase_requestDetail.warehouse_id = value.data.warehouse[0].warehouse_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  businesspartnerData: any = [];
  getBusinesspartner() {
    this.httpService.http_api_post('company/businesspartner/select', { is_use: '1', businesspartner_category_id: 3 }).subscribe((value) => {

      if (value.success) {
        this.businesspartnerData = value.data.businesspartner;
        if(this.businesspartnerData[0]){
          this.formPurchase_request.patchValue({
            businesspartner_id: this.businesspartnerData[0].businesspartner_id
          })
          this._formPurchase_request.businesspartner_id= this.businesspartnerData[0].businesspartner_id
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  branchData: any = [];
  getBranch() {
    this.httpService.http_api_post('apps/branch/s', {}).subscribe((value) => {

      if (value.success) {
        this.branchData = value.data.branch;
        if (value.data.branch.length > 0) {
          this._formPurchase_request.branch_id = value.data.branch[0].branch_id;
          this.formPurchase_request.patchValue({ branch_id: value.data.branch[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchase_categoryData: any = [];
  getPurchase_requestcategory() {
    this.httpService.http_api_get('transaction/purchase/category/').subscribe((value) => {

      if (value.success) {
        this.purchase_categoryData = value.data.purchase_category;
        if (value.data.purchase_category.length > 0) {
          this._formPurchase_request.purchase_category_id = value.data.purchase_category[0].purchase_category_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchaseStatusData: any = [];
  getPurchase_requestsStatus() {
    this.httpService.http_api_get('transaction/purchase/status/').subscribe((value) => {

      if (value.success) {
        this.purchaseStatusData = value.data.status;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchase_requestsDetailDelete(item) {
    if (confirm("Are you sure to delete this data?")) {
      item.is_active = 0;
      this.count();
    }
  }

  Modal4Header;
  modal4Show() {
    this.getPurchase_requestList();
    this.childModal4.show();
  }

  modal4Hide() {
    this.childModal4.hide();
  }

  modal4Out(item) {

    this.setpurchase_request(item.data);

    if (this.formPurchase_request.value.oripurchase_status_id != 5) {
      this.formFieldDisabledEnabled(1);
    } else {
      this.formFieldDisabledEnabled(0);
    }

    this.getPurchase_requestsDetail();
    this.modal4Hide();
  }

  settings2 : any = {
    actions: {
      delete: false,
      // add: false
    },
    mode: 'external',
    edit: {
      editButtonContent: `${this.gen.td_selectTbl3}`,
      confirmSave: true,
    },
    add: {
      addButtonContent: `${this.gen.td_refreshTbl3}`,
      confirmSave: true,
    },
    columns: {
      branch_name: {
        title: this.gen.th_branchTbl3,
        type: 'string',
        editable: false
      },
      purchase_request_code: {
        title: this.gen.th_codeTbl3,
        type: 'string',
        editable: false
      },
      transaction_date_show: {
        title: this.gen.th_dateTbl3,
        type: 'string',
        editable: false
      },
      businesspartner_name: {
        title: this.gen.th_customerTbl3,
        type: 'string'
      },
      purchase_request_status_name: {
        title: this.gen.th_statusTbl3,
        type: 'string'
      },
      employee_name: {
        title: this.gen.th_createByTbl3,
        type: 'string'
      },
    },
    pager: {
      perPage: 75
    }
  };
  source2: LocalDataSource = new LocalDataSource();

  getPurchase_requestList() {
    this.httpService.http_api_post('transaction/purchase_request/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source2.load(value.data.purchase_requests);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getPurchase_requestsDetail() {
    this.httpService.http_api_post('transaction/purchase_request/detail', { purchase_request_id: this.formPurchase_request.value.purchase_request_id }).subscribe((value) => {

      if (value.success) {
        this.purchase_requestsDetail = value.data.purchase_request_detail;
        this.count();
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ngModalChange() {
  }

  purchase_requestParse: any;
  purchase_requestSubmit(status) {

    this.count();
    this.purchase_requestParse = this.copying(this.formPurchase_request.getRawValue());
    if (status != 0) {
      this.purchase_requestParse.purchase_status_id = status;
    }
    this.purchase_requestParse.purchase_request_detail = this.copying(this.purchase_requestsDetail);
    this.purchase_requestParse.update_by = this.httpService.currentUser.employee_id;
    this.purchase_requestParse.update_datetime = new Date();

    if (this.purchase_requestParse.purchase_request_id == '') {
      this.purchase_requestParse.create_by = this.httpService.currentUser.employee_id;
      this.purchase_requestParse.create_datetime = new Date();
      this.httpService.http_api_post('transaction/purchase_request', this.purchase_requestParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setpurchase_request(this.purchase_requestParse);
            this.formPurchase_request.patchValue({
              purchase_request_code: value.data.purchase_request_code,
              purchase_request_id: value.data.purchase_request_id,
              oripurchase_status_id: this.formPurchase_request.value.purchase_status_id,
            })

            if (this.formPurchase_request.value.oripurchase_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getPurchase_requestsDetail();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.saveUpdate();
    }

  }

  saveUpdate() {

    this.httpService.http_api_put('transaction/purchase_request', this.purchase_requestParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPurchase_request.value.is_active == 0) {
            this.clearAll();
          } else {

            if (value.data.purchase_request_code) {
              this.purchase_requestParse.purchase_request_code = value.data.purchase_request_code;
            }

            this.setpurchase_request(this.purchase_requestParse);
            this.formPurchase_request.patchValue({ oripurchase_status_id: this.formPurchase_request.value.purchase_status_id });
            if (this.formPurchase_request.value.oripurchase_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getPurchase_requestsDetail();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  purchase_requestDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPurchase_request.patchValue({ is_active: 0 });
      this.purchase_requestSubmit(0);
    }
  }

  purchase_requestsDetailChange(value) {
    this.count();
  }

  clearAll() {
    this.setpurchase_request(false);

    this.formFieldDisabledEnabled(1);

    this.purchase_requestsDetail = JSON.parse("[]");
    this.formPurchase_requestDetail.reset(this._formPurchase_requestDetail)
    this.purchase_requestDetailQuantityCount = 0;
    this.purchase_requestDetailLength = 0;
  }

  purchase_requestDetailQuantityCount = 0;
  purchase_requestDetailLength = 0;

  count() {

    if (this.purchase_requestsDetail.length > 0) {
      this.purchase_requestDetailQuantityCount = 0;
      this.purchase_requestDetailLength = 0;

      for (let e of this.purchase_requestsDetail) {

        if (e.is_active == 1) {

          this.purchase_requestDetailQuantityCount += e.quantity;
          this.purchase_requestDetailLength += 1;

          e.quantityeqv = e.quantity;

          if (e.uom_order == 1) {
            e.quantityeqv = e.quantity;
          } else if (e.uom_order == 2) {
            e.quantityeqv = e.uom2equal * e.quantity;
          } else if (e.uom_order == 3) {
            e.quantityeqv = e.uom3equal * e.quantity;
          }

        }

      }

    }

  }


  purchase_requestDetailUomOrderChange() {

    if (this.formPurchase_requestDetail.value.uom_order == 1) {
      this.formPurchase_requestDetail.patchValue({ quantityeqv: this.formPurchase_requestDetail.value.quantity });
      this.formPurchase_requestDetail.value.uom_label = this.formPurchase_requestDetail.value.uom1;
    } else if (this.formPurchase_requestDetail.value.uom_order == 2) {
      this.formPurchase_requestDetail.patchValue({ quantityeqv: this.formPurchase_requestDetail.value.uom2equal * this.formPurchase_requestDetail.value.quantity });
      this.formPurchase_requestDetail.patchValue({ uom_label: this.formPurchase_requestDetail.value.uom2 });
    } else if (this.formPurchase_requestDetail.value.uom_order == 3) {
      this.formPurchase_requestDetail.patchValue({ quantityeqv: this.formPurchase_requestDetail.value.uom3equal * this.formPurchase_requestDetail.value.quantity });
      this.formPurchase_requestDetail.patchValue({ uom_label: this.formPurchase_requestDetail.value.uom3 });
    }

  }

  isPurchaseOrderQuantity() {
    if (this.formPurchase_request.value.oripurchase_status_id == 5) {
      return true;
    } else {
      return false;
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
