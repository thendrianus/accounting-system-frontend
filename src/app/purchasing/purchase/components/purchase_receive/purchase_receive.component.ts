import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'purchase_receive',
  styleUrls: ['./purchase_receive.scss'],
  templateUrl: './purchase_receive.html',
})
export class Purchase_receive {

  purchase_receivesDetail: any = [];

  formPurchase_receive;
  formPurchase_receiveDetail;
  formTerm;
  currentUser: any = { employee_job_id: 0 };

  public minDate: Date = void 0;
  public dateDisabled: { date: Date, mode: string }[];

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formPurchase_receive = { purchase_receive_id: '', purchase_receive_detail: [], purchase_receive_code: '', reference_code: '', purchase_id: '', businesspartner_id: '', branch_id: '', warehouse_id: '', transaction_date: moment().format("YYYY-MM-DD"), description: '-', purchase_category_id: 1, purchase_link_id: 0, purchase_status_id: 1, received_by: '', delivered_by: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, oripurchase_status_id: 1, }

  disableInput: any = {}

  _formPurchase_receiveDetail = { purchase_receive_detail_id: '', purchase_receive_id: '', inventory_id: '', inventory_code: '', name: '', warehouse_id: '', quantity: 1, quantityeqv: 1, ordered: 0, orderedeqv: 0, uom_order: 1, uom_label: '', row_order: 1, row_label: '', inventory_label: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, uom1: '', uom2: '', uom3: '', uom2equal: 1, uom3equal: 1, stock: 0 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formPurchase_receive = this.formBuilder.group({ //sssss
      purchase_receive_id: '',
      purchase_receive_detail: [],
      purchase_receive_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      reference_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      purchase_id: '',
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      purchase_category_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      purchase_link_id: 0,
      purchase_status_id: 1,
      received_by: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      delivered_by: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      oripurchase_status_id: 1,
    });

    this.formPurchase_receiveDetail = this.formBuilder.group({ //sssss
      purchase_receive_detail_id: '',
      purchase_receive_id: '',
      inventory_id: '',
      inventory_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      quantityeqv: 1,
      ordered: 0,
      orderedeqv: 0,
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

    this.disableInput.purchase_receive_code = true;
    this.disableInput.purchase_category_id = true;
    this.disableInput.businesspartner_id = true;
    this.disableInput.reference_code = true;



  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formPurchase_receive');
    console.log(this.formPurchase_receive);
    console.log('this.formPurchase_receiveDetail');
    console.log(this.formPurchase_receiveDetail);
  }

  formPurchase_receiveField = [{ name: "businesspartner_id" }, { name: "branch_id" }, { name: "warehouse_id" }, { name: "purchase_category_id" }, { name: "delivered_by" }, { name: "received_by" }, { name: "transaction_date" }, { name: "description" }];

  formButton = [{ name: 'New Item', show: true }];

  disabledSpecialFormField() {
    this.disableInput.inventory_code = true;
    this.disableInput.name = true;
    this.disableInput.warehouse_id = true;
    // this.disableInput.transaction_date= true;
    this.disableInput.purchase_receive_code = true;
  }

  formFieldDisabledEnabled(io) {
    if (io == 0) {
      for (let e of this.formPurchase_receiveField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formButton) {
        e.show = false;
      }
    } else {
      for (let e of this.formPurchase_receiveField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formButton) {
        e.show = true;
      }
    }

    if (this.formPurchase_receive.value.purchase_receive_id == "") {
      this.disableInput.purchase_receive_code = false;
    } else {
      this.disableInput.purchase_receive_code = true;
    }

    this.disableInput.reference_code = true;

  }

  gen: any = { "app_component_id": 0, "_title": "Purchase Receive", "_code": "Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "_titleM3": "Title Modal", "_titleM4": "Title Modal", "ph_code": "Code", "ph_reference": "Reference", "ph_description": "Description", "ph_deliveredBy": "Delivered By", "ph_inventory_codeM1": "Inventory Code", "ph_nameM1": "Name", "ph_quantityM1": "Quantity", "ph_descriptionM1": "Description", "at_code": "Code", "at_category": "Category", "at_customer": "Customer", "at_date": "Date", "at_reference": "Reference", "at_branch": "Branch", "at_warehouse": "Warehouse", "at_description": "Description", "at_deliveredBy": "Delivered By", "at_receiveBy": "Receive By", "at_inventory_codeM1": "Inventory Code", "at_nameM1": "Name", "at_warehouseM1": "Warehouse", "at_quantityM1": "Quantity", "at_uomM1": "UOM", "at_descriptionM1": "Description", "btn_add": " Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_edit_transaction": "Edit Transaction", "btn_import": "Import", "btn_new_item": "New Item", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_editM1": "Edit", "btn_closeM2": "Close", "btn_closeM3": "Close", "btn_closeM4": "Close", "th_action": "Action", "th_inventory_code": "Inventory Code", "th_name": "Name", "th_quantity": "Quantity", "th_ordered": "Ordered", "th_uom": "UOM", "th_total": "Total", "th_item": "Item", "th_codeTbl2": "Code", "th_nameTbl2": "Name", "th_brandTbl2": "Brand", "th_uomTbl2": "UOM", "th_stockTbl2": "Stock", "th_descriptionTbl2": "Description", "th_branchTbl3": "Branch", "th_codeTbl3": "Code", "th_transaction_dateTbl3": "Transaction Date", "th_customerTbl3": "Customer", "th_statusTbl3": "Status", "th_createByTbl3": "Created By", "th_codeTbl4": "Code", "th_dateTbl4": "Date", "th_branchTbl4": "Branch", "th_employeeTbl4": "Employee", "th_statusTbl4": "Status", "th_business_partnerTbl4": "Business Partner", "td_selectTbl2": "Select", "td_refreshTbl2": "Refresh", "td_selectTbl3": "Select", "td_refreshTbl3": "Refresh", "td_selectTbl4": "Select", "td_refreshTbl4": "Refresh" };

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
    this.httpService.getTranslate('36').subscribe(
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
          this.getPurchase_receivecategory();
          this.getPurchase_receivesStatus();
          this.getEmployee();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  setpurchase_receive(data) {
    if (data) {
      // // data.businesspartner_id = "" + data.businesspartner_id + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.formPurchase_receive.patchValue(this.copying(data));
    } else {
      this.formPurchase_receive.reset(this._formPurchase_receive)
    }
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  @ViewChild('childModal') public childModal: ModalDirective; // inventory search
  @ViewChild('childModal2') public childModal2: ModalDirective; // purchase_receive detail form
  @ViewChild('childModal4') public childModal4: ModalDirective; //purchase_receive search
  @ViewChild('childModalImportbtn') public childModalImportbtn: ModalDirective; //Import btn

  @ViewChild('childModalImport') public childModalImport: ModalDirective; //Import search

  public ModalHeader: string;

  modalShow(item) {

    this.ModalHeader = 'Account Detail';

    if (item == '-') {
      this.ifModal2show = -1;
      this.modal2Out(this.source[item]);
      this.ModalHeader = this.gen._titleM1;
    } else {
      this.ifModal2show = item;
      this.ModalHeader = this.gen._titleM2;
      this.modal2Out(this.purchase_receivesDetail[item]);
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {

    if (this.ifModal2show == -1) {
      this.purchase_receivesDetail.push(this.copying(this.formPurchase_receiveDetail.getRawValue()));
    } else {
      this.purchase_receivesDetail[this.ifModal2show] = this.copying(this.formPurchase_receiveDetail.getRawValue());
    }
    this.formPurchase_receiveDetail.reset(this._formPurchase_receiveDetail);
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
      })
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

    for (let index = 0; index < this.purchase_receivesDetail.length; index++) {

      if (this.purchase_receivesDetail[index].inventory_id == event.inventory_id) {

        if (this.purchase_receivesDetail[index].is_active == 1) {
          this.ifModal2show = index;
        } else {
          this.ifModal2show = -1;
        }
      }

    }

    if (this.ifModal2show == -1) {
      this.formPurchase_receiveDetail.reset(this._formPurchase_receiveDetail);
    } else {
      this.formPurchase_receiveDetail.patchValue(this.copying(this.purchase_receivesDetail[this.ifModal2show]));
    }

    if (this.formPurchase_receiveDetail.value.inventory_id != event.inventory_id) {
      this.formPurchase_receiveDetail.patchValue({
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

      if (!this.formPurchase_receiveDetail.value.inventory_label) {
        this.formPurchase_receiveDetail.patchValue({ inventory_label: event.name });
      }
    }

    this.childModal.show();
    this.modal2Hide();

  }

  getInventoryList() {
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 2 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.inventory);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  warehouseChange() {
    this._formPurchase_receiveDetail.warehouse_id = this.formPurchase_receive.value.warehouse_id;
  }

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        if (value.data.warehouse.length > 0) {
          this._formPurchase_receive.warehouse_id = value.data.warehouse[0].warehouse_id;
          this.formPurchase_receive.patchValue({ warehouse_id: value.data.warehouse[0].warehouse_id });
          this._formPurchase_receiveDetail.warehouse_id = value.data.warehouse[0].warehouse_id;
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
          this.formPurchase_receive.patchValue({
            businesspartner_id: this.businesspartnerData[0].businesspartner_id
          })
          this._formPurchase_receive.businesspartner_id= this.businesspartnerData[0].businesspartner_id
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
          this._formPurchase_receive.branch_id = value.data.branch[0].branch_id;
          this.formPurchase_receive.patchValue({ branch_id: value.data.branch[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchase_categoryData: any = [];
  getPurchase_receivecategory() {
    this.httpService.http_api_get('transaction/purchase/category/').subscribe((value) => {

      if (value.success) {
        this.purchase_categoryData = value.data.purchase_category;
        if (value.data.purchase_category.length > 0) {
          this._formPurchase_receive.purchase_category_id = value.data.purchase_category[0].purchase_category_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchaseStatusData: any = [];
  getPurchase_receivesStatus() {
    this.httpService.http_api_get('transaction/purchase/status/').subscribe((value) => {

      if (value.success) {
        this.purchaseStatusData = value.data.status;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  employeeData: any = [];
  getEmployee() {
    this.httpService.http_api_post('hrd/employee/select', { is_use: '1' }).subscribe((value) => {
      if (value.success) {
        this.employeeData = value.data.employee;
        if (value.data.employee.length > 0) {
          this._formPurchase_receive.received_by = value.data.employee[0].employee_id;
          this.formPurchase_receive.patchValue({ received_by: value.data.employee[0].employee_id });
        }
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchase_receivesDetailDelete(item) {
    if (confirm("Are you sure to delete this data?")) {
      item.is_active = 0;
      this.count();
    }
  }

  Modal4Header;
  modal4Show() {
    this.getPurchase_receiveList();
    this.childModal4.show();
  }

  modal4Hide() {
    this.childModal4.hide();
  }

  modal4Out(item) {

    this.setpurchase_receive(item.data);

    if (this.formPurchase_receive.value.oripurchase_status_id != 5) {
      this.formFieldDisabledEnabled(1);
    } else {
      this.formFieldDisabledEnabled(0);
    }

    this.getPurchase_receivesDetail();
    this.modal4Hide();
  }

  settings2 : any = {
    actions: {
      delete: false,
      add: false
    },
    mode: 'external',
    edit: {
      editButtonContent: `${this.gen.td_selectTbl2}`,
      confirmSave: true,
    },
    columns: {
      branch_name: {
        title: this.gen.th_branchTbl3,
        type: 'string',
        editable: false
      },
      purchase_receive_code: {
        title: this.gen.th_codeTbl3,
        type: 'string',
        editable: false
      },
      transaction_date_show: {
        title: this.gen.th_transaction_dateTbl3,
        type: 'string',
        editable: false
      },
      businesspartner_name: {
        title: this.gen.th_customerTbl3,
        type: 'string'
      },
      purchase_receive_status_name: {
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

  getPurchase_receiveList() {
    this.httpService.http_api_post('transaction/purchase_receive/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source2.load(value.data.purchase_receives);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getPurchase_receivesDetail() {
    this.httpService.http_api_post('transaction/purchase_receive/detail', { purchase_receive_id: this.formPurchase_receive.value.purchase_receive_id }).subscribe((value) => {

      if (value.success) {
        this.purchase_receivesDetail = value.data.purchase_receive_detail;
        this.count();
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ngModalChange() {
  }

  purchase_receiveParse: any;
  purchase_receiveSubmit(status) {

    this.count();
    this.purchase_receiveParse = this.copying(this.formPurchase_receive.getRawValue());
    if (status != 0) {
      this.purchase_receiveParse.purchase_status_id = status;
    }
    this.purchase_receiveParse.purchase_receive_detail = this.copying(this.purchase_receivesDetail);
    this.purchase_receiveParse.update_by = this.httpService.currentUser.employee_id;
    this.purchase_receiveParse.update_datetime = new Date();

    if (this.purchase_receiveParse.purchase_receive_id == '') {
      this.purchase_receiveParse.create_by = this.httpService.currentUser.employee_id;
      this.purchase_receiveParse.create_datetime = new Date();

      this.httpService.http_api_post('transaction/purchase_receive', this.purchase_receiveParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setpurchase_receive(this.purchase_receiveParse);
            this.formPurchase_receive.patchValue({
              purchase_receive_code: value.data.purchase_receive_code,
              purchase_receive_id: value.data.purchase_receive_id,
              oripurchase_status_id: this.formPurchase_receive.value.purchase_status_id,
            })

            if (this.formPurchase_receive.value.oripurchase_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getPurchase_receivesDetail();
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

    this.httpService.http_api_put('transaction/purchase_receive', this.purchase_receiveParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPurchase_receive.value.is_active == 0) {
            this.clearAll();
          } else {

            if (value.data.purchase_receive_code) {
              this.purchase_receiveParse.purchase_receive_code = value.data.purchase_receive_code;
            }

            this.setpurchase_receive(this.purchase_receiveParse);
            this.formPurchase_receive.patchValue({ oripurchase_status_id: this.formPurchase_receive.value.purchase_status_id });
            if (this.formPurchase_receive.value.oripurchase_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getPurchase_receivesDetail();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  purchase_receiveDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPurchase_receive.patchValue({ is_active: 0 });
      this.purchase_receiveSubmit(0);
    }
  }

  purchase_receivesDetailChange(value) {
    this.count();
  }

  clearAll() {
    this.setpurchase_receive(false);

    this.formFieldDisabledEnabled(1);

    this.purchase_receivesDetail = JSON.parse("[]");
    this.formPurchase_receiveDetail.reset(this._formPurchase_receiveDetail);
    this.purchase_receiveDetailQuantityCount = 0;
    this.purchase_receiveDetailOrderedCount = 0;
    this.purchase_receiveDetailLength = 0;
  }

  purchase_receiveDetailQuantityCount = 0;
  purchase_receiveDetailOrderedCount = 0
  purchase_receiveDetailLength = 0;

  count() {

    if (this.purchase_receivesDetail.length > 0) {
      this.purchase_receiveDetailQuantityCount = 0;
      this.purchase_receiveDetailOrderedCount = 0;
      this.purchase_receiveDetailLength = 0;

      for (let e of this.purchase_receivesDetail) {

        if (e.is_active == 1) {

          this.purchase_receiveDetailQuantityCount += e.quantity;
          this.purchase_receiveDetailOrderedCount += e.ordered
          this.purchase_receiveDetailLength += 1;

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

    // this.formFieldDisabledEnabled(1);

  }


  purchase_receiveDetailUomOrderChange() {

    if (this.formPurchase_receiveDetail.value.uom_order == 1) {
      this.formPurchase_receiveDetail.patchValue({
        quantityeqv: this.formPurchase_receiveDetail.value.quantity,
        uom_label: this.formPurchase_receiveDetail.value.uom1,
      })
    } else if (this.formPurchase_receiveDetail.value.uom_order == 2) {
      this.formPurchase_receiveDetail.patchValue({
        quantityeqv: this.formPurchase_receiveDetail.value.uom2equal * this.formPurchase_receiveDetail.value.quantity,
        uom_label: this.formPurchase_receiveDetail.value.uom2,
      })
    } else if (this.formPurchase_receiveDetail.value.uom_order == 3) {
      this.formPurchase_receiveDetail.patchValue({
        quantityeqv: this.formPurchase_receiveDetail.value.uom3equal * this.formPurchase_receiveDetail.value.quantity,
        uom_label: this.formPurchase_receiveDetail.value.uom3,
      })
    }

  }

  isPurchaseOrderQuantity() {
    if (this.formPurchase_receive.value.oripurchase_status_id == 5) {
      return true;
    } else {
      return false;
    }
  }


  ModalImportHeader;
  modalImportShow(importlink) {
    this.childModalImportbtn.hide();
    this.getImportList(importlink);
    this.childModalImport.show();
  }

  modalImportHide() {
    this.childModalImport.hide();
  }

  modalImportOut(item) {
    // item.businesspartner_id = "" + item.businesspartner_id + "";
    this.formPurchase_receive.reset(this._formPurchase_receive);
    let data: any = {};
    if (item.businesspartner_id) { data.businesspartner_id = item.businesspartner_id; }
    if (item.branch_id) { data.branch_id = item.branch_id; }
    if (item.warehouse_id) { data.warehouse_id = item.warehouse_id; }
    if (item.description) { data.description = item.description; }
    if (item.purchase_category_id) { data.purchase_category_id = item.purchase_category_id; }
    if (item.purchase_link_id) { data.purchase_link_id = item.purchase_link_id; }

    this.formPurchase_receive.patchValue(data)

    if (item.purchase_id) {
      this.formPurchase_receive.patchValue({ reference_code: item.purchase_code });

      this.httpService.http_api_post('transaction/purchase/detail', { purchase_id: item.purchase_id }).subscribe((value) => {

        if (value.success) {
          this.setImportDetail(value.data.purchase_detail);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    if (item.purchase_order_id) {
      this.formPurchase_receive.patchValue({ reference_code: item.purchase_order_code });

      this.httpService.http_api_post('transaction/purchase_orders/detail', { purchase_order_id: item.purchase_order_id }).subscribe((value) => {

        if (value.success) {
          this.setImportDetail(value.data.purchase_order_detail);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    this.modalImportHide();

  }

  setImportDetail(item) {

    for (var i in item) {

      this.formPurchase_receiveDetail.reset(this._formPurchase_receiveDetail);

      let data: any = {};
      if (item[i].inventory_id) { data.inventory_id = item[i].inventory_id; }
      if (item[i].inventory_code) { data.inventory_code = item[i].inventory_code; }
      if (item[i].name) { data.name = item[i].name; }
      if (item[i].inventory_label) { data.inventory_label = item[i].inventory_label; }
      if (item[i].warehouse_id) { data.warehouse_id = item[i].warehouse_id; }
      if (item[i].quantity) { data.quantity = item[i].quantity; }
      if (item[i].quantityeqv) { data.quantityeqv = item[i].quantityeqv; }
      if (item[i].ordered) { data.ordered = item[i].ordered; }
      if (item[i].orderedeqv) { data.orderedeqv = item[i].orderedeqv; }
      if (item[i].uom_order) { data.uom_order = item[i].uom_order; }
      if (item[i].uom_label) { data.uom_label = item[i].uom_label; }
      if (item[i].row_order) { data.row_order = item[i].row_order; }
      if (item[i].row_label) { data.row_label = item[i].row_label; }
      if (item[i].description) { data.description = item[i].description; }
      if (item[i].uom1) { data.uom1 = item[i].uom1; }
      if (item[i].uom2) { data.uom2 = item[i].uom2; }
      if (item[i].uom3) { data.uom3 = item[i].uom3; }
      if (item[i].uom2equal) { data.uom2equal = item[i].uom2equal; }
      if (item[i].uom3equal) { data.uom3equal = item[i].uom3equal; }
      if (item[i].stock) { data.stock = item[i].stock }

      this.purchase_receivesDetail.push(this.copying({
        ...this._formPurchase_receiveDetail,
        ...data
      }));

    }

    this.count();
  }

  settingsImport = {
    actions: {
      delete: false,
      add: false
    },
    mode: 'external',
    edit: {
      editButtonContent: `${this.gen.td_selectTbl4}`,
      confirmSave: true,
    },
    add: {
      addButtonContent: `${this.gen.td_refreshTbl4}`,
      confirmSave: true,
    },
    columns: {
      code: {
        title: this.gen.th_codeTbl4,
        type: 'string',
        editable: false
      },
      transaction_date_show: {
        title: this.gen.th_dateTbl4,
        type: 'string',
        editable: false
      },
      branch_name: {
        title: this.gen.th_branchTbl4,
        type: 'string',
        editable: false
      },
      employee_name: {
        title: this.gen.th_employeeTbl4,
        type: 'string',
        editable: false
      },
      purchase_status_name: {
        title: this.gen.th_statusTbl4,
        type: 'string',
        editable: false
      },
      businesspartner_name: {
        title: this.gen.th_business_partnerTbl4,
        type: 'string',
        editable: false
      },
    },
    pager: {
      perPage: 75
    }
  };
  sourceImport: LocalDataSource = new LocalDataSource();

  getImportList(importlink) {

    if (importlink == 'purchase') {
      this.httpService.http_api_post('transaction/purchase/select', { is_use: 1, action: 1 }).subscribe((value) => {

        if (value.success) {
          this.sourceImport.load(value.data.purchases);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    if (importlink == 'purchase_orders') {
      this.httpService.http_api_post('transaction/purchase_orders/select', { is_use: 1, action: 1 }).subscribe((value) => {

        if (value.success) {
          this.sourceImport.load(value.data.purchase_orders);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
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
