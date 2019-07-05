import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'sale_delivery',
  styleUrls: ['./sale_delivery.scss'],
  templateUrl: './sale_delivery.html',
})
export class Sale_delivery {

  sale_deliverysDetail: any = [];

  formSale_delivery;
  formSale_deliveryDetail;
  formTerm;
  currentUser: any = { employee_job_id: 0 };

  public minDate: Date = void 0;
  public dateDisabled: { date: Date, mode: string }[];

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formSale_delivery = { sale_delivery_id: '', sale_delivery_detail: [], sale_delivery_code: '', reference_code: '', sale_id: '', businesspartner_id: '', branch_id: '', warehouse_id: '', transaction_date: moment().format("YYYY-MM-DD"), description: '-', sale_category_id: 1, sale_link_id: 0, sale_status_id: 1, delivered_by: '', received_by: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, orisale_status_id: 1, }

  _formSale_deliveryDetail = { sale_delivery_detail_id: '', sale_delivery_id: '', inventory_id: '', inventory_code: '', name: '', warehouse_id: '', quantity: 1, quantityeqv: 1, ordered: 0, orderedeqv: 0, uom_order: 1, uom_label: '', row_order: 1, row_label: '', inventory_label: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, uom1: '', uom2: '', uom3: '', uom2equal: 1, uom3equal: 1, stock: 0 }

  sale_delivery: any = this.copying(this._formSale_delivery);

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formSale_delivery = this.formBuilder.group({ //sssss
      sale_delivery_id: '',
      sale_delivery_detail: [],
      sale_delivery_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      reference_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      sale_id: '',
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      sale_category_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      sale_link_id: 0,
      sale_status_id: 1,
      delivered_by: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      received_by: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      orisale_status_id: 1,
    });

    this.formSale_deliveryDetail = this.formBuilder.group({ //sssss
      sale_delivery_detail_id: '',
      sale_delivery_id: '',
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

    this.disableInput.sale_category_id = true;
    this.disableInput.businesspartner_id = true;
    this.disableInput.sale_delivery_code = true;
    this.disableInput.reference_code = true;

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formSale_delivery');
    console.log(this.formSale_delivery);
    console.log('this.formSale_deliveryDetail');
    console.log(this.formSale_deliveryDetail);
  }

  formSale_deliveryField = [{ name: "businesspartner_id" }, { name: "branch_id" }, { name: "warehouse_id" }, { name: "sale_category_id" }, { name: "description" }];

  formButton = [{ name: 'New Item', show: true }];

  disabledSpecialFormField() {
    this.disableInput.inventory_code = true;
    this.disableInput.name = true;
    this.disableInput.transaction_date = true;
    this.disableInput.sale_delivery_code = true;
  }

  formFieldDisabledEnabled(io) {
    if (io == 0) {
      for (let e of this.formSale_deliveryField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formButton) {
        e.show = false;
      }
    } else {
      for (let e of this.formSale_deliveryField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formButton) {
        e.show = true;
      }
    }

    if (this.formSale_delivery.value.sale_delivery_id == "") {
      this.disableInput.sale_delivery_code = false;
    } else {
      this.disableInput.sale_delivery_code = true;
    }

    this.disableInput.reference_code = true;

  }

  gen: any = { "app_component_id": 0, "_title": "Sale Delivery", "_code": "Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "_titleM3": "Title Modal", "_titleM4": "Title Modal", "ph_code": "Code", "ph_reference": "Reference", "ph_description": "Description", "ph_receiveBy": "Receive By", "ph_inventory_codeM1": "Inventory Code", "ph_nameM1": "Name", "ph_quantityM1": "Quantity", "ph_descriptionM1": "Description", "at_code": "Code", "at_category": "Category", "at_customer": "Customer", "at_date": "Date", "at_reference": "Reference", "at_branch": "Branch", "at_warehouse": "Warehouse", "at_description": "Description", "at_deliveredBy": "Delivered By", "at_receiveBy": "Receive By", "at_inventory_codeM1": "Inventory Code", "at_nameM1": "Name", "at_warehouseM1": "Warehouse", "at_quantityM1": "Quantity", "at_uomM1": "UOM", "at_descriptionM1": "Description", "btn_add": " Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_edit_transaction": "Edit Transaction", "btn_import": "Import", "btn_new_item": "New Item", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_editM1": "Edit", "btn_closeM2": "Close", "btn_closeM3": "Close", "btn_closeM4": "Close", "th_action": "Action", "th_inventory_code": "Inventory Code", "th_name": "Name", "th_quantity": "Quantity", "th_ordered": "Ordered", "th_uom": "UOM", "th_total": "Total", "th_item": "Item", "th_codeTbl2": "Code", "th_nameTbl2": "Name", "th_brandTbl2": "Brand", "th_uomTbl2": "UOM", "th_stockTbl2": "Stock", "th_descriptionTbl2": "Description", "th_branchTbl3": "Branch", "th_codeTbl3": "Code", "th_dateTbl3": "Date", "th_customerTbl3": "Customer", "th_statusTbl3": "Status", "th_createByTbl3": "Created By", "th_codeTbl4": "Code", "th_dateTbl4": "Date", "th_branchTbl4": "Branch", "th_employeeTbl4": "Employee", "th_statusTbl4": "Status", "th_business_partnerTbl4": "Business Partner", "td_selectTbl2": "Select", "td_refreshTbl2": "Refresh", "td_selectTbl3": "Select", "td_refreshTbl3": "Refresh", "td_selectTbl4": "Select", "td_refreshTbl4": "Refresh" };

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
    this.httpService.getTranslate('40').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.sale_delivery_code = true;
          this.disabledSpecialFormField();

          this.getWarehouse();
          this.getBusinesspartner();
          this.getBranch();
          this.getSale_deliverycategory();
          this.getSale_deliverysStatus();
          this.getEmployee();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  setsale_delivery(data) {
    if (data) {
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      // // data.businesspartner_id = "" + data.businesspartner_id + "";
      this.formSale_delivery.patchValue(this.copying(data));
    } else {
      this.formSale_delivery.reset(this._formSale_delivery)
    }
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  @ViewChild('childModal') public childModal: ModalDirective; // inventory search
  @ViewChild('childModal2') public childModal2: ModalDirective; // sale_delivery detail form
  @ViewChild('childModal4') public childModal4: ModalDirective; //sale_delivery search

  @ViewChild('childModalImport') public childModalImport: ModalDirective; //Import search
  @ViewChild('childModalImportbtn') public childModalImportbtn: ModalDirective; //Import btn

  public ModalHeader: string;

  modalShow(item) {

    this.ModalHeader = 'Account Detail';

    if (item == '-') {
      this.ifModal2show = -1;
      this.modal2Out(this.source[item]);
      this.ModalHeader = this.gen._titleM1;
    } else {
      this.ifModal2show = item;
      this.modal2Out(this.sale_deliverysDetail[item]);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {

    if (this.ifModal2show == -1) {
      this.sale_deliverysDetail.push(this.copying(this.formSale_deliveryDetail.getRawValue()));
    } else {
      this.sale_deliverysDetail[this.ifModal2show] = this.copying(this.formSale_deliveryDetail.getRawValue());
    }
    this.formSale_deliveryDetail.reset(this._formSale_deliveryDetail);
    this.modalHide();
    this.count();

    // for (let item in this.sale_deliverysDetail) {
    //   if (item) {

    //   }
    // }

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

    for (let index = 0; index < this.sale_deliverysDetail.length; index++) {

      if (this.sale_deliverysDetail[index].inventory_id == event.inventory_id) {

        if (this.sale_deliverysDetail[index].is_active == 1) {
          this.ifModal2show = index;
        } else {
          this.ifModal2show = -1;
        }
      }

    }

    if (this.ifModal2show == -1) {
      this.formSale_deliveryDetail.reset(this._formSale_deliveryDetail);
    } else {
      this.formSale_deliveryDetail.patchValue(this.copying(this.sale_deliverysDetail[this.ifModal2show]));
    }

    if (this.formSale_deliveryDetail.value.inventory_id != event.inventory_id) {

      this.formSale_deliveryDetail.patchValue({
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


      if (!this.formSale_deliveryDetail.value.inventory_label) {
        this.formSale_deliveryDetail.patchValue({
          inventory_label: event.name
        })
      }
    }

    this.childModal.show();
    this.modal2Hide();

  }

  getInventoryList() {
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: 1, is_use: 1, is_action: 1 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.inventory);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  warehouseChange() {
    this._formSale_deliveryDetail.warehouse_id = this.formSale_delivery.value.warehouse_id;
  }

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        if (value.data.warehouse.length > 0) {
          this._formSale_delivery.warehouse_id = value.data.warehouse[0].warehouse_id;
          this.formSale_delivery.patchValue({ warehouse_id: value.data.warehouse[0].warehouse_id });
          this._formSale_deliveryDetail.warehouse_id = value.data.warehouse[0].warehouse_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  businesspartnerData: any = [];
  getBusinesspartner() {
    this.httpService.http_api_post('company/businesspartner/select', { is_use: '1', businesspartner_category_id: 2 }).subscribe((value) => {

      if (value.success) {
        this.businesspartnerData = value.data.businesspartner;
        if(this.businesspartnerData[0]){
          this.formSale_delivery.patchValue({
            businesspartner_id: this.businesspartnerData[0].businesspartner_id
          })
          this._formSale_delivery.businesspartner_id= this.businesspartnerData[0].businesspartner_id
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
          this._formSale_delivery.branch_id = value.data.branch[0].branch_id;
          this.formSale_delivery.patchValue({ branch_id: value.data.branch[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  sale_categoryData: any = [];
  getSale_deliverycategory() {
    this.httpService.http_api_get('transaction/sale/category/').subscribe((value) => {

      if (value.success) {
        this.sale_categoryData = value.data.sale_category;
        if (value.data.sale_category.length > 0) {
          this._formSale_delivery.sale_category_id = value.data.sale_category[0].sale_category_id;
          this.formSale_delivery.patchValue({ sale_category_id: value.data.sale_category[0].sale_category_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  saleStatusData: any = [];
  getSale_deliverysStatus() {
    this.httpService.http_api_get('transaction/sale/status/').subscribe((value) => {

      if (value.success) {
        this.saleStatusData = value.data.status;
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
          this._formSale_delivery.delivered_by = value.data.employee[0].employee_id;
          this.formSale_delivery.patchValue({ delivered_by: value.data.employee[0].employee_id });
        }
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  sale_deliverysDetailDelete(item) {
    if (confirm("Are you sure to delete this data?")) {
      item.is_active = 0;
      this.count();
    }
  }

  Modal4Header;
  modal4Show() {
    this.getSale_deliveryList();
    this.childModal4.show();
  }

  modal4Hide() {
    this.childModal4.hide();
  }

  modal4Out(item) {

    this.setsale_delivery(item.data);

    if (this.formSale_delivery.value.orisale_status_id != 5) {
      this.formFieldDisabledEnabled(1);
    } else {
      this.formFieldDisabledEnabled(0);
    }

    this.getSale_deliverysDetail();
    this.modal4Hide();
  }

  settings2 : any = {
    actions: {
      delete: false,
      add: false
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
      sale_delivery_code: {
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
      sale_delivery_status_name: {
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

  getSale_deliveryList() {
    this.httpService.http_api_post('transaction/sale_delivery/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source2.load(value.data.sale_deliverys);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getSale_deliverysDetail() {
    this.httpService.http_api_post('transaction/sale_delivery/detail', { sale_delivery_id: this.formSale_delivery.value.sale_delivery_id }).subscribe((value) => {

      if (value.success) {
        this.sale_deliverysDetail = value.data.sale_delivery_detail;
        this.count();
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ngModalChange() {

  }

  sale_deliveryParse: any;
  sale_deliverySubmit(status) {

    this.count();
    this.sale_deliveryParse = this.copying(this.formSale_delivery.getRawValue());
    if (status != 0) {
      this.sale_deliveryParse.sale_status_id = status;
    }
    this.sale_deliveryParse.sale_delivery_detail = this.copying(this.sale_deliverysDetail);
    this.sale_deliveryParse.update_by = this.httpService.currentUser.employee_id;
    this.sale_deliveryParse.update_datetime = new Date();

    if (this.sale_deliveryParse.sale_delivery_id == '') {
      this.sale_deliveryParse.create_by = this.httpService.currentUser.employee_id;
      this.sale_deliveryParse.create_datetime = new Date();
      this.httpService.http_api_post('transaction/sale_delivery', this.sale_deliveryParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setsale_delivery(this.sale_deliveryParse);
            this.formSale_delivery.patchValue({
              sale_delivery_code: value.data.sale_delivery_code,
              sale_delivery_id: value.data.sale_delivery_id,

              orisale_status_id: this.formSale_delivery.value.sale_status_id,
            })

            if (this.formSale_delivery.value.orisale_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getSale_deliverysDetail();
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

    this.httpService.http_api_put('transaction/sale_delivery', this.sale_deliveryParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formSale_delivery.value.is_active == 0) {
            this.clearAll();
          } else {

            if (value.data.sale_delivery_code) {
              this.sale_deliveryParse.sale_delivery_code = value.data.sale_delivery_code;
            }

            this.setsale_delivery(this.sale_deliveryParse);
            this.formSale_delivery.patchValue({ orisale_status_id: this.formSale_delivery.value.sale_status_id });
            if (this.formSale_delivery.value.orisale_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getSale_deliverysDetail();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  sale_deliveryDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formSale_delivery.patchValue({ is_active: 0 });
      this.sale_deliverySubmit(0);
    }
  }

  sale_deliverysDetailChange(value) {
    this.count();
  }

  clearAll() {
    this.setsale_delivery(false);

    this.formFieldDisabledEnabled(1);

    this.sale_deliverysDetail = JSON.parse("[]");
    this.formSale_deliveryDetail.reset(this._formSale_deliveryDetail);
    this.sale_deliveryDetailQuantityCount = 0;
    this.sale_deliveryDetailOrderedCount = 0;
    this.sale_deliveryDetailLength = 0;
  }

  sale_deliveryDetailQuantityCount = 0;
  sale_deliveryDetailOrderedCount = 0
  sale_deliveryDetailLength = 0;

  count() {

    if (this.sale_deliverysDetail.length > 0) {
      this.sale_deliveryDetailQuantityCount = 0;
      this.sale_deliveryDetailOrderedCount = 0;
      this.sale_deliveryDetailLength = 0;

      for (let e of this.sale_deliverysDetail) {

        if (e.is_active == 1) {

          this.sale_deliveryDetailQuantityCount += e.quantity;
          this.sale_deliveryDetailOrderedCount += e.ordered
          this.sale_deliveryDetailLength += 1;

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


  sale_deliveryDetailUomOrderChange() {

    if (this.formSale_deliveryDetail.value.uom_order == 1) {
      this.formSale_deliveryDetail.patchValue({
        quantityeqv: this.formSale_deliveryDetail.value.quantity,
        uom_label: this.formSale_deliveryDetail.value.uom1,
      })
    } else if (this.formSale_deliveryDetail.value.uom_order == 2) {
      this.formSale_deliveryDetail.patchValue({
        quantityeqv: this.formSale_deliveryDetail.value.uom2equal * this.formSale_deliveryDetail.value.quantity,
        uom_label: this.formSale_deliveryDetail.value.uom2,
      })
    } else if (this.formSale_deliveryDetail.value.uom_order == 3) {
      this.formSale_deliveryDetail.patchValue({
        quantityeqv: this.formSale_deliveryDetail.value.uom3equal * this.formSale_deliveryDetail.value.quantity,
        uom_label: this.formSale_deliveryDetail.value.uom3,
      })
    }

  }

  isSaleOrderQuantity() {
    if (this.formSale_delivery.value.orisale_status_id == 5) {
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
    this.formSale_delivery.reset(this._formSale_delivery);

    let data: any = {}

    if (item.businesspartner_id) { data.businesspartner_id = item.businesspartner_id; }
    if (item.branch_id) { data.branch_id = item.branch_id; }
    if (item.warehouse_id) { data.warehouse_id = item.warehouse_id; }
    if (item.description) { data.description = item.description; }
    if (item.sale_category_id) { data.sale_category_id = item.sale_category_id; }
    if (item.sale_link_id) { data.sale_link_id = item.sale_link_id; }

    this.formSale_delivery.patchValue(data)

    if (item.sale_id) {
      this.formSale_delivery.patchValue({ reference_code: item.sale_code });

      this.httpService.http_api_post('transaction/sale/detail', { sale_id: item.sale_id }).subscribe((value) => {

        if (value.success) {
          this.setImportDetail(value.data.sale_detail);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    if (item.sale_order_id) {
      this.formSale_delivery.patchValue({ reference_code: item.sale_order_code });

      this.httpService.http_api_post('transaction/sale_orders/detail', { sale_order_id: item.sale_order_id }).subscribe((value) => {

        if (value.success) {
          this.setImportDetail(value.data.sale_order_detail);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    if (item.sale_do_id) {
      this.formSale_delivery.patchValue({ reference_code: item.sale_do_code });

      this.httpService.http_api_post('transaction/sale_delivery_order/detail', { sale_do_id: item.sale_do_id }).subscribe((value) => {

        if (value.success) {
          this.setImportDetail(value.data.sale_do_detail);
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

      this.formSale_deliveryDetail.reset(this._formSale_deliveryDetail);

      let data: any = {}

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
      console.log(item)
      this.sale_deliverysDetail.push(this.copying({
        ...this._formSale_deliveryDetail,
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
      sale_status_name: {
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
    if (importlink == 'sale_do') {
      this.httpService.http_api_post('transaction/sale_delivery_order/select', { is_use: 1, action: 1 }).subscribe((value) => {

        if (value.success) {
          this.sourceImport.load(value.data.sale_dos);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    if (importlink == 'sale') {
      this.httpService.http_api_post('transaction/sale/select', { is_use: 1, action: 1 }).subscribe((value) => {

        if (value.success) {
          this.sourceImport.load(value.data.sales);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    if (importlink == 'sale_orders') {
      this.httpService.http_api_post('transaction/sale_orders/select', { is_use: 1, action: 1 }).subscribe((value) => {

        if (value.success) {
          this.sourceImport.load(value.data.sale_orders);
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
