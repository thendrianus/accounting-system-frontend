import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'purchase_quotation',
  styleUrls: ['./purchase_quotation.scss'],
  templateUrl: './purchase_quotation.html',
})
export class Purchase_quotation {

  purchase_quotationsDetail: any = [];

  formPurchase_quotation;
  formPurchase_quotationDetail;
  formDelivery;
  formTerm;
  currentUser: any = { employee_job_id: 0 };

  public minDate: Date = void 0;
  public dateDisabled: { date: Date, mode: string }[];

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

  _formPurchase_quotation = { purchase_quotation_id: '', purchase_quotation_detail: [], purchase_quotation_code: '', currency_id: '', rate: '', businesspartner_id: '', branch_id: '', warehouse_id: '', transaction_date: moment().format("YYYY-MM-DD"), description: '-', discount_amount: 0, discount_persent: 0, tax_id: '', landed_cost: 0, purchasesman_id: '', payable: 0, delivery_address: '-', tax: 0, purchase_category_id: 1, transaction_payment_id: 1, sub_total: 0, discount_date: 0, due_date: 0, early_discount: 0, late_charge: 0, purchase_link_id: 0, isdelivery: "0", delivery_note: '-', delivery_schedule: new Date(), reference_label: '-', reference_code: '-', purchase_status_id: 1, downpayment: 0, downpayment_persent: 0, grand_total: 0, update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, oripurchase_status_id: 1, orisub_total: 0, oritax: 0, origrand_total: 0, oridownpayment: 0, orilanded_cost: 0, oripayable: 0 }

  _formDelivery = { delivery_address: '-', delivery_note: '-', delivery_schedule: moment().format("YYYY-MM-DD"), }

  _formTerm = { discount_date: 0, due_date: 0, early_discount: 0, late_charge: 0, }

  disableInput: any = {}

  _formPurchase_quotationDetail = { purchase_quotation_detail_id: '', purchase_quotation_id: '', inventory_id: '', inventory_code: '', name: '', warehouse_id: '', ordered: 1, orderedeqv: 1, inventory_hpp: 0, delivered: 0, deliveredeqv: 0, price: 0, landed_cost: 0, discount_persent: 0, discount_amount: 0, uom_order: 1, uom_label: '', row_order: 1, row_label: '', isdelivery: 0, tax_id: '', tax: 0, delivery_schedule: new Date(), delivery_note: '-', inventory_label: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, oriprice: 0, uom1: '', uom2: '', uom3: '', uom2equal: 1, uom3equal: 1, min_price: 0, selling_price: 0, selling_price2: 0, selling_price3: 0, selling_dsc_amount: 0, selling_dsc_amount2: 0, selling_dsc_amount3: 0, stock: 0 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formPurchase_quotation = this.formBuilder.group({ //sssss
      purchase_quotation_id: '',
      purchase_quotation_detail: [],
      purchase_quotation_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      currency_id: '',
      rate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      transaction_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      discount_amount: [0],
      discount_persent: [0],
      tax_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      landed_cost: [0],
      purchasesman_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      payable: [0],
      delivery_address: '-',
      tax: [0],
      purchase_category_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      transaction_payment_id: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      sub_total: 0,
      discount_date: 0,
      due_date: 0,
      early_discount: 0,
      late_charge: 0,
      purchase_link_id: 0,
      isdelivery: ["0", [Validators.minLength(0), Validators.maxLength(20)]],
      delivery_note: '-',
      delivery_schedule: new Date(),
      reference_label: '-',
      reference_code: ['-', [Validators.minLength(0), Validators.maxLength(20)]],
      purchase_status_id: 1,
      downpayment: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      downpayment_persent: [0, [Validators.minLength(0), Validators.maxLength(15)]],
      grand_total: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      oripurchase_status_id: 1,
      orisub_total: 0,
      oritax: 0,
      origrand_total: 0,
      oridownpayment: 0,
      orilanded_cost: 0,
      oripayable: 0
    });

    this.formDelivery = this.formBuilder.group({ //sssss
      delivery_address: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      delivery_note: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      delivery_schedule: moment().format("YYYY-MM-DD"),
    });

    this.formTerm = this.formBuilder.group({ //sssss
      discount_date: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      due_date: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      early_discount: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      late_charge: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    });

    this.formPurchase_quotationDetail = this.formBuilder.group({ //sssss
      purchase_quotation_detail_id: '',
      purchase_quotation_id: '',
      inventory_id: '',
      inventory_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      warehouse_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      ordered: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      orderedeqv: 1,
      inventory_hpp: 0,
      delivered: 0,
      deliveredeqv: 0,
      price: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      landed_cost: [0],
      discount_persent: [0],
      discount_amount: [0],
      uom_order: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom_label: '',
      row_order: 1,
      row_label: '',
      isdelivery: 0,
      tax_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      tax: 0,
      delivery_schedule: new Date(),
      delivery_note: '-',
      inventory_label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      oriprice: 0,
      uom1: '',
      uom2: '',
      uom3: '',
      uom2equal: 1,
      uom3equal: 1,
      min_price: 0,
      selling_price: 0,
      selling_price2: 0,
      selling_price3: 0,
      selling_dsc_amount: 0,
      selling_dsc_amount2: 0,
      selling_dsc_amount3: 0,
      stock: 0
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formPurchase_quotation');
    console.log(this.formPurchase_quotation);
    console.log('this.formDelivery');
    console.log(this.formDelivery);
    console.log('this.formTerm');
    console.log(this.formTerm);
    console.log('this.formPurchase_quotationDetail');
    console.log(this.formPurchase_quotationDetail);
  }

  formPurchase_quotationField = [{ name: "businesspartner_id" }, { name: "branch_id" }, { name: "warehouse_id" }, { name: "transaction_date" }, { name: "currency_id" }, { name: "rate" }, { name: "discount_amount" }, { name: "discount_persent" }, { name: "tax_id" }, { name: "landed_cost" }, { name: "purchasesman_id" }, { name: "purchase_category_id" }, { name: "transaction_payment_id" }, { name: "currency_id" }, { name: "isdelivery" }, { name: "downpayment" }, { name: "downpayment_persent" }, { name: "description" }, { name: "reference_code" }];

  formDeliveryField = [{ name: "delivery_address" }, { name: "delivery_note" }, { name: "delivery_schedule" }];

  formTermField = [{ name: "discount_date" }, { name: "due_date" }, { name: "early_discount" }, { name: "late_charge" }];

  formButton = [{ name: 'New Item', show: true }, { name: 'Import Reference', show: true }];

  disabledSpecialFormField() {
    this.disableInput.inventory_code = true;
    this.disableInput.name = true;
    this.disableInput.grand_total = true;
    this.disableInput.tax = true;
    this.disableInput.payable = true;
    this.disableInput.purchase_quotation_code = true;
  }

  formFieldDisabledEnabled(io) {
    console.log('formFieldDisabledEnabled ' + io)
    if (io == 0) {
      for (let e of this.formPurchase_quotationField) {
        console.log(e.name);
        this.disableInput[e.name] = true;
      }
      for (let e of this.formDeliveryField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formTermField) {
        this.disableInput[e.name] = true;
      }
      for (let e of this.formButton) {
        e.show = false;
      }
    } else {
      for (let e of this.formPurchase_quotationField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formDeliveryField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formTermField) {
        this.disableInput[e.name] = false;
      }
      for (let e of this.formButton) {
        e.show = true;
      }
    }

  }

  gen: any = { "app_component_id": 0, "_title": "Purchase Quotation", "_code": "Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "_titleM3": "Title Modal", "_titleM4": "Title Modal", "_titleM5": "Title Modal", "_titleM6": "Title Modal", "ph_code": "Code", "ph_reference": "Reference", "ph_rate": "Rate", "ph_term": " Term", "ph_description": "Description", "ph_landed_cost": "Landed Cost", "ph_tax": "Tax", "ph_downpayment": "Downpayment", "ph_inventory_codeM1": "Inventory Code", "ph_nameM1": "Name", "ph_orderedM1": "Ordered", "ph_priceM1": "Price", "ph_discountM1": "Discount", "ph_descriptionM1": "Description", "ph_deliveryAddressM3": "Delivery Address", "ph_deliveryNoteM3": "Delivery Note", "ph_discountDateM5": "Discount Date", "ph_dueDateM5": "Due Date", "ph_earlyDiscountM5": "Early Discount", "ph_lateChargeM5": "Late Charge", "at_code": "Code", "at_category": "Category", "at_customer": "Customer", "at_date": "Date", "at_reference": "Reference", "at_branch": "Branch", "at_warehouse": "Warehouse", "at_tax": "Tax", "at_payment": "Payment", "at_currency": "Currency", "at_rate": "Rate", "at_term": " Term", "at_purchaseman": "Purchaseman", "at_description": "Description", "at_delivery": "Delivery", "at_landed_cost": "Landed Cost", "at_discount": "Discount", "at_tax2": "Tax", "at_grand_total": "Grand Total", "at_downpayment": "Downpayment", "at_receivable": "Receivable", "at_inventory_codeM1": "Inventory Code", "at_nameM1": "Name", "at_warehouseM1": "Warehouse", "at_orderedM1": "Quantity", "at_uomM1": "UOM", "at_priceM1": "Price", "at_discountM1": "Discount", "at_taxM1": "Tax", "at_descriptionM1": "Description", "at_dateM3": "Date", "at_deliveryAddressM3": "Delivery Address", "at_deliveryNoteM3": "Delivery Note", "at_discountDateM5": "Discount Date", "at_dueDateM5": "Due Date", "at_earlyDiscountM5": "Early Discount", "at_lateChargeM5": "Late Charge", "btn_add": " Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_edit_transaction": "Edit Transaction", "btn_import": "Import", "btn_term": " Term", "btn_new_item": "New Item", "btn_delivery": "Delivery", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_editM1": "Edit", "btn_closeM2": "Close", "btn_closeM3": "Close", "btn_set_dataM3": "Set Data", "btn_closeM4": "Close", "btn_closeM5": "Close", "btn_set_dataM5": "Set Data", "btn_closeM6": "Close", "th_action": "Action", "th_inventory_code": "Inventory Code", "th_name": "Name", "th_quantity": "Quantity", "th_uom": "UOM", "th_price": "Price", "th_discount": "Discount", "th_total": "Total", "th_total2": "Total", "th_tax": "Tax", "th_item": "Item", "th_codeTbl2": "Code", "th_nameTbl2": "Name", "th_brandTbl2": "Brand", "th_priceTbl2": "Price", "th_uomTbl2": "UOM", "th_stockTbl2": "Stock", "th_descriptionTbl2": "Description", "th_branchTbl3": "Branch", "th_purchase_quotationTbl3": "Purchase Quotation", "th_transaction_dateTbl3": "Transaction Date", "th_customerTbl3": "Customer", "th_currencyTbl3": "Currency", "th_paymentTbl3": "Payment", "th_grand_totalTbl3": "Grand Total", "th_statusTbl3": "Status", "th_createByTbl3": "Created By", "th_codeTbl4": "Code", "th_transaction_dateTbl4": "Date", "th_branchTbl4": "Branch", "th_employeeTbl4": "Employee", "th_statusTbl4": "Status", "th_business_partnerTbl4": "Business Partner", "td_selectTbl2": "Select", "td_refreshTbl2": "Refresh", "td_selectTbl3": "Select", "td_refreshTbl3": "Refresh", "td_selectTbl4": "Select", "td_refreshTbl4": "Refresh" };

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
    this.httpService.getTranslate('35').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disabledSpecialFormField();
          this.getWarehouse();
          this.getTax();
          this.getBusinesspartner();
          this.getBranch();
          this.gettransaction_payment();
          this.getPurchase_quotationcategory();
          this.getpurchasesman();
          this.getPurchase_quotationsStatus();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  setpurchase_quotation(data) {
    if (data) {
      data.delivery_schedule = moment(data.delivery_schedule).format("YYYY-MM-DD")
      // // data.businesspartner_id = "" + data.businesspartner_id + "";
      data.transaction_date = moment(data.transaction_date).format("YYYY-MM-DD")
      this.formPurchase_quotation.patchValue(this.copying(data));
    } else {
      this.formPurchase_quotation.reset(this._formPurchase_quotation)
    }
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  @ViewChild('childModal') public childModal: ModalDirective; // inventory search
  @ViewChild('childModal2') public childModal2: ModalDirective; // purchase_quotation detail form
  @ViewChild('childModal3') public childModal3: ModalDirective; //purchase_quotation delivery form
  @ViewChild('childModal4') public childModal4: ModalDirective; //purchase_quotation search
  @ViewChild('childModal5') public childModal5: ModalDirective; //term

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
      this.modal2Out(this.purchase_quotationsDetail[item]);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {

    if (this.ifModal2show == -1) {
      this.purchase_quotationsDetail.push(this.copying(this.formPurchase_quotationDetail.getRawValue()));
    } else {
      this.purchase_quotationsDetail[this.ifModal2show] = this.copying(this.formPurchase_quotationDetail.getRawValue());
    }
    this.formPurchase_quotationDetail.reset(this._formPurchase_quotationDetail);
    this.modalHide();
    this.count();

    // for (let item in this.purchase_quotationsDetail) {
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
        buying_price: {
          title: this.gen.th_priceTbl2,
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

    for (let index = 0; index < this.purchase_quotationsDetail.length; index++) {

      if (this.purchase_quotationsDetail[index].inventory_id == event.inventory_id) {

        if (this.purchase_quotationsDetail[index].is_active == 1) {
          this.ifModal2show = index;
        } else {
          this.ifModal2show = -1;
        }
      }

    }

    if (this.ifModal2show == -1) {
      this.formPurchase_quotationDetail.patchValue(this.copying(this._formPurchase_quotationDetail))
    } else {
      this.formPurchase_quotationDetail.patchValue(this.copying(this.purchase_quotationsDetail[this.ifModal2show]))
    }

    if (this.formPurchase_quotationDetail.value.inventory_id != event.inventory_id) {

      this.formPurchase_quotationDetail.patchValue({
        uom_order: 1,
        uom_label: event.uom1,

        uom1: event.uom1,
        uom2: event.uom2,
        uom3: event.uom3,

        uom2equal: event.uom2equal,
        uom3equal: event.uom3equal,

        min_price: event.min_price,
        selling_price: event.selling_price,
        selling_price2: event.selling_price2,
        selling_price3: event.selling_price3,
        selling_dsc_amount: event.selling_dsc_amount,
        selling_dsc_amount2: event.selling_dsc_amount2,
        selling_dsc_amount3: event.selling_dsc_amount3,

        stock: event.stock,

        inventory_id: event.inventory_id,
        inventory_code: event.inventory_code,
        name: event.name,
        price: event.buying_price,
        oriprice: event.buying_price,
        inventory_hpp: event.inventory_hpp,
      })

      if (!this.formPurchase_quotationDetail.value.inventory_label) {
        this.formPurchase_quotationDetail.patchValue({
          inventory_label: event.name
        })
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
    this._formPurchase_quotationDetail.warehouse_id = this.formPurchase_quotation.value.warehouse_id;
  }

  taxChange() {
    this._formPurchase_quotationDetail.tax_id = this.formPurchase_quotation.value.tax_id;
  }

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        if (value.data.warehouse.length > 0) {
          this._formPurchase_quotation.warehouse_id = value.data.warehouse[0].warehouse_id;
          this.formPurchase_quotation.patchValue({ warehouse_id: value.data.warehouse[0].warehouse_id });
          this._formPurchase_quotationDetail.warehouse_id = value.data.warehouse[0].warehouse_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  taxData: any = [];
  getTax() {
    this.httpService.http_api_post('apps/tax/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.taxData = value.data.tax;
        if (value.data.tax.length > 0) {
          this._formPurchase_quotation.tax_id = value.data.tax[0].tax_id;
          this.formPurchase_quotation.patchValue({ tax_id: value.data.tax[0].tax_id });
          this._formPurchase_quotationDetail.tax_id = value.data.tax[0].tax_id;
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
          this.formPurchase_quotation.patchValue({
            businesspartner_id: this.businesspartnerData[0].businesspartner_id
          })
          this._formPurchase_quotation.businesspartner_id= this.businesspartnerData[0].businesspartner_id
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
          this._formPurchase_quotation.branch_id = value.data.branch[0].branch_id;
          this.formPurchase_quotation.patchValue({ branch_id: value.data.branch[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchase_categoryData: any = [];
  getPurchase_quotationcategory() {
    this.httpService.http_api_get('transaction/purchase/category/').subscribe((value) => {

      if (value.success) {
        this.purchase_categoryData = value.data.purchase_category;
        if (value.data.purchase_category.length > 0) {
          this._formPurchase_quotation.purchase_category_id = value.data.purchase_category[0].purchase_category_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  transaction_paymentData: any = [];
  gettransaction_payment() {
    this.httpService.http_api_get('transaction/purchase/payment/').subscribe((value) => {

      if (value.success) {
        this.transaction_paymentData = value.data.transaction_payment;
        if (value.data.transaction_payment.length > 0) {
          this._formPurchase_quotation.transaction_payment_id = value.data.transaction_payment[0].transaction_payment_id;
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchasesmanData: any = [];
  getpurchasesman() {
    this.httpService.http_api_put('hrd/employee/select', { action: 'salesman' }).subscribe((value) => {
      ;
      if (value.success) {
        this.purchasesmanData = value.data.employee;
        if (value.data.employee.length > 0) {
          this._formPurchase_quotation.purchasesman_id = value.data.employee[0].employee_id;
          this.formPurchase_quotation.patchValue({ purchasesman_id: value.data.employee[0].employee_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchaseStatusData: any = [];
  getPurchase_quotationsStatus() {
    this.httpService.http_api_get('transaction/purchase/status/').subscribe((value) => {

      if (value.success) {
        this.purchaseStatusData = value.data.status;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  purchase_quotationsDetailDelete(item) {
    if (confirm("Are you sure to delete this data?")) {
      item.is_active = 0;
      this.count();
    }
  }

  Modal3Header;
  modal3Show() {
    this.childModal3.show();
    this.getBusinesspartneraddress();
  }

  modal3Hide() {
    this.childModal3.hide();
  }

  formDeliverySubmit() {
    this.modal3Hide();
  }

  Modal4Header;
  modal4Show() {
    this.getPurchase_quotationList();
    this.childModal4.show();
  }

  modal4Hide() {
    this.childModal4.hide();
  }

  modal4Out(item) {

    this.setpurchase_quotation(item.data);

    if (this.formPurchase_quotation.value.oripurchase_status_id != 5) {
      this.formFieldDisabledEnabled(1);
    } else {
      this.formFieldDisabledEnabled(0);
    }

    this.getPurchase_quotationsDetail();
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
      purchase_quotation_code: {
        title: this.gen.th_purchase_quotationTbl3,
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
      currency_id: {
        title: this.gen.th_currencyTbl3,
        type: 'string'
      },
      transaction_payment_name: {
        title: this.gen.th_paymentTbl3,
        type: 'string'
      },
      grand_total: {
        title: this.gen.th_grand_totalTbl3,
        type: 'number'
      },
      purchase_quotation_status_name: {
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

  getPurchase_quotationList() {
    this.httpService.http_api_post('transaction/purchase_quotation/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source2.load(value.data.purchase_quotations);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getPurchase_quotationsDetail() {
    this.httpService.http_api_post('transaction/purchase_quotation/detail', { purchase_quotation_id: this.formPurchase_quotation.value.purchase_quotation_id }).subscribe((value) => {

      if (value.success) {
        this.purchase_quotationsDetail = value.data.purchase_quotation_detail;
        this.count();
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  setCurrencyData(event) {
    this._formPurchase_quotation.currency_id = event.currency_id;
    this._formPurchase_quotation.rate = event.rate;
    this.formPurchase_quotation.patchValue({
      currency_id: event.currency_id,
      rate: event.rate
    })

    this.moneyOption.prefix = event.currency_id + '. ';

  }

  ngModalChange() {

  }

  purchase_quotationParse: any;
  purchase_quotationSubmit(status) {

    this.count();
    this.purchase_quotationParse = this.copying(this.formPurchase_quotation.getRawValue());
    if (status != 0) {
      this.purchase_quotationParse.purchase_status_id = status;
    }
    this.purchase_quotationParse.purchase_quotation_detail = this.copying(this.purchase_quotationsDetail);
    this.purchase_quotationParse.update_by = this.httpService.currentUser.employee_id;
    this.purchase_quotationParse.update_datetime = new Date();

    this.purchase_quotationParse.orisub_total = this.purchase_quotationParse.sub_total;
    this.purchase_quotationParse.oritax = this.purchase_quotationParse.tax;
    this.purchase_quotationParse.origrand_total = this.purchase_quotationParse.grand_total;
    this.purchase_quotationParse.oridownpayment = this.purchase_quotationParse.downpayment;
    this.purchase_quotationParse.orilanded_cost = this.purchase_quotationParse.landed_cost;
    this.purchase_quotationParse.oripayable = this.purchase_quotationParse.payable;

    if (this.purchase_quotationParse.purchase_quotation_id == '') {
      this.purchase_quotationParse.create_by = this.httpService.currentUser.employee_id;
      this.purchase_quotationParse.create_datetime = new Date();

      this.httpService.http_api_post('transaction/purchase_quotation', this.purchase_quotationParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setpurchase_quotation(this.purchase_quotationParse);
            this.formPurchase_quotation.patchValue({
              purchase_quotation_code: value.data.purchase_quotation_code,
              purchase_quotation_id: value.data.purchase_quotation_id,
              oripurchase_status_id: this.formPurchase_quotation.value.purchase_status_id
            })

            if (this.formPurchase_quotation.value.oripurchase_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getPurchase_quotationsDetail();
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

    this.httpService.http_api_put('transaction/purchase_quotation', this.purchase_quotationParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPurchase_quotation.value.is_active == 0) {
            this.clearAll();
          } else {

            if (value.data.purchase_quotation_code) {
              this.purchase_quotationParse.purchase_quotation_code = value.data.purchase_quotation_code;
            }

            this.setpurchase_quotation(this.purchase_quotationParse);
            this.formPurchase_quotation.patchValue({ oripurchase_status_id: this.formPurchase_quotation.value.purchase_status_id });
            if (this.formPurchase_quotation.value.oripurchase_status_id != 5) {
              this.formFieldDisabledEnabled(1);
            } else {
              this.formFieldDisabledEnabled(0);
            }

            this.getPurchase_quotationsDetail();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  purchase_quotationDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPurchase_quotation.patchValue({ is_active: 0 });
      this.purchase_quotationSubmit(0);
    }
  }

  Modal5Header;
  modal5Show() {
    this.childModal5.show();
  }

  modal5Hide() {
    this.childModal5.hide();
  }

  formTermSubmit() {
    this.modal5Hide();
  }

  purchase_quotationsDetailChange(value) {
    this.count();
  }

  clearAll() {
    this.setpurchase_quotation(false);

    this.formFieldDisabledEnabled(1);

    this.purchase_quotationsDetail = JSON.parse("[]");
    this.formPurchase_quotationDetail.reset(this._formPurchase_quotationDetail);
    this.purchase_quotationDetailOrderedCount = 0;
    this.purchase_quotationDetailDiscountCount = 0;
    this.purchase_quotationDetailPriceCount = 0;
    this.purchase_quotationDetailLength = 0;
    this.disableInput.reference_code = false;
  }

  purchase_quotationDetailOrderedCount = 0;
  purchase_quotationDetailDiscountCount = 0;
  purchase_quotationDetailPriceCount = 0;

  purchase_quotationDetailLength = 0;

  count() {

    if (this.purchase_quotationsDetail.length > 0) {
      this.purchase_quotationDetailOrderedCount = 0;
      this.purchase_quotationDetailDiscountCount = 0;
      this.purchase_quotationDetailPriceCount = 0;
      this.purchase_quotationDetailLength = 0;

      this.formPurchase_quotation.patchValue({
        sub_total: 0,
        tax: 0,
        detail_landed_cost: 0
      })

      for (let e of this.purchase_quotationsDetail) {

        if (e.is_active == 1) {
          e.discount_amount = (e.price * e.ordered) * e.discount_persent / 100;

          this.purchase_quotationDetailOrderedCount += e.ordered;
          this.purchase_quotationDetailDiscountCount += e.discount_amount;
          this.purchase_quotationDetailLength += 1;
          this.purchase_quotationDetailPriceCount += e.price;

          var sub_totalParse = (e.price * e.ordered) - e.discount_amount + e.landed_cost;
          this.formPurchase_quotation.patchValue({
            detail_landed_cost: this.formPurchase_quotation.value.detail_landed_cost + e.landed_cost,
            sub_total: this.formPurchase_quotation.value.sub_total + sub_totalParse
          })

          e.orderedeqv = e.ordered;
          e.deliveredeqv = e.delivered;

          if (e.uom_order == 1) {
            e.orderedeqv = e.ordered;
            e.deliveredeqv = e.delivered;
          } else if (e.uom_order == 2) {
            e.orderedeqv = e.uom2equal * e.ordered;
            e.deliveredeqv = e.uom2equal * e.delivered;
          } else if (e.uom_order == 3) {
            e.orderedeqv = e.uom3equal * e.ordered;
            e.deliveredeqv = e.uom3equal * e.delivered;
          }

          for (let f of this.taxData) {

            if (e.tax_id == f.tax_id) {
              e.tax = sub_totalParse * f.percentage / 100;
              this.formPurchase_quotation.patchValue({
                tax: this.formPurchase_quotation.value.tax + e.tax
              })
            }

          }
        }

      }

      var grand_total = this.formPurchase_quotation.value.sub_total + this.formPurchase_quotation.value.landed_cost + this.formPurchase_quotation.value.tax - this.formPurchase_quotation.value.discount_amount;

      this.formPurchase_quotation.patchValue({
        grand_total: grand_total,
        payable: grand_total - this.formPurchase_quotation.value.downpayment,
        downpayment_persent: this.formPurchase_quotation.value.downpayment / grand_total * 100
      })

    }

    // this.formFieldDisabledEnabled(1);

  }

  purchase_quotationDiscountCountAmount(event) {
    if (this.purchase_quotationsDetail.length > 0) {
      this.formPurchase_quotation.patchValue({ discount_amount: (this.formPurchase_quotation.value.sub_total + this.formPurchase_quotation.value.landed_cost) * this.formPurchase_quotation.value.discount_persent / 100 });
      this.count();
    }
  }

  purchase_quotationDiscountCountPersent(event) {
    if (this.purchase_quotationsDetail.length > 0) {
      this.formPurchase_quotation.patchValue({ discount_persent: this.formPurchase_quotation.value.discount_amount / (this.formPurchase_quotation.value.sub_total + this.formPurchase_quotation.value.landed_cost) * 100 });
      this.count()
    }
  }

  purchase_quotationDownpaymentCountAmount(event) {
    if (this.purchase_quotationsDetail.length > 0) {
      this.formPurchase_quotation.patchValue({ downpayment: this.formPurchase_quotation.value.grand_total * this.formPurchase_quotation.value.downpayment_persent / 100 });
      this.count();
    }
  }

  purchase_quotationDownpaymentCountPersent(event) {
    if (this.purchase_quotationsDetail.length > 0) {
      this.formPurchase_quotation.patchValue({ downpayment_persent: this.formPurchase_quotation.value.downpayment / this.formPurchase_quotation.value.grand_total * 100 });
      this.count();
    }
  }

  purchase_quotationDetailUomOrderChange() {
    console.log(this.formPurchase_quotationDetail)
    if (this.formPurchase_quotationDetail.value.uom_order == 1) {
      this.formPurchase_quotationDetail.patchValue({
        orderedeqv: this.formPurchase_quotationDetail.value.ordered,
        deliveredeqv: this.formPurchase_quotationDetail.value.delivered,
        uom_label: this.formPurchase_quotationDetail.value.uom1,
        price: this.formPurchase_quotationDetail.value.buying_price,
        min_price: this.formPurchase_quotationDetail.value.selling_dsc_amount,
      })
    } else if (this.formPurchase_quotationDetail.value.uom_order == 2) {
      this.formPurchase_quotationDetail.patchValue({
        orderedeqv: this.formPurchase_quotationDetail.value.uom2equal * this.formPurchase_quotationDetail.value.ordered,
        deliveredeqv: this.formPurchase_quotationDetail.value.uom2equal * this.formPurchase_quotationDetail.value.delivered,
        uom_label: this.formPurchase_quotationDetail.value.uom2,
        price: this.formPurchase_quotationDetail.value.selling_price2,
        min_price: this.formPurchase_quotationDetail.value.selling_dsc_amount,
      })
    } else if (this.formPurchase_quotationDetail.value.uom_order == 3) {
      this.formPurchase_quotationDetail.patchValue({
        orderedeqv: this.formPurchase_quotationDetail.value.uom3equal * this.formPurchase_quotationDetail.value.ordered,
        deliveredeqv: this.formPurchase_quotationDetail.value.uom3equal * this.formPurchase_quotationDetail.value.delivered,
        uom_label: this.formPurchase_quotationDetail.value.uom3,
        price: this.formPurchase_quotationDetail.value.selling_price3,
        min_price: this.formPurchase_quotationDetail.value.selling_dsc_amount,
      })
    }

  }

  isPurchaseOrderOrdered() {
    if (this.formPurchase_quotation.value.oripurchase_status_id == 5) {
      return true;
    } else {
      return false;
    }
  }


  ModalImportHeader;
  modalImportShow(importlink) {
    this.getImportList(importlink);
    this.childModalImport.show();
  }

  modalImportHide() {
    this.childModalImport.hide();
  }

  modalImportOut(item) {
    // item.businesspartner_id = "" + item.businesspartner_id + "";
    this.setpurchase_quotation(false);
    console.log(item)
    let data: any = {};

    if (item.currency_id) { data.currency_id = item.currency_id; }
    if (item.rate) { data.rate = item.rate; }
    if (item.businesspartner_id) { data.businesspartner_id = item.businesspartner_id; }
    if (item.branch_id) { data.branch_id = item.branch_id; }
    if (item.warehouse_id) { data.warehouse_id = item.warehouse_id; }
    if (item.description) { data.description = item.description; }
    if (item.discount_persent) { data.discount_persent = item.discount_persent; }
    if (item.tax_id) { data.tax_id = item.tax_id; }
    if (item.landed_cost) { data.landed_cost = item.landed_cost; }
    if (item.purchasesman_id) { data.purchasesman_id = item.purchasesman_id; }
    if (item.delivery_address) { data.delivery_address = item.delivery_address; }
    if (item.purchase_category_id) { data.purchase_category_id = item.purchase_category_id; }
    if (item.transaction_payment_id) { data.transaction_payment_id = item.transaction_payment_id; }
    if (item.discount_date) { data.discount_date = item.discount_date; }
    if (item.due_date) { data.due_date = item.due_date; }
    if (item.early_discount) { data.early_discount = item.early_discount; }
    if (item.late_charge) { data.late_charge = item.late_charge; }
    if (item.purchase_link_id) { data.purchase_link_id = item.purchase_link_id; }
    if (item.isdelivery) { data.isdelivery = item.isdelivery; }
    if (item.delivery_note) { data.delivery_note = item.delivery_note; }
    if (item.delivery_schedule) { data.delivery_schedule = new Date(item.delivery_schedule); }
    if (item.downpayment) { data.downpayment = item.downpayment; }

    this.formPurchase_quotation.patchValue(data)

    if (item.purchase_request_id) {
      this.formPurchase_quotation.patchValue({
        reference_label: 'Purchase Request',
        reference_code: item.purchase_request_code
      })

      this.httpService.http_api_post('transaction/purchase_request/detail', { purchase_request_id: item.purchase_request_id }).subscribe((value) => {

        if (value.success) {
          this.setImportDetail(value.data.purchase_request_detail);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

    this.modalImportHide();

    this.disableInput.reference_code= true;

  }

  setImportDetail(item) {

    for (var i in item) {

      this.formPurchase_quotationDetail.reset(this._formPurchase_quotationDetail);
      let data: any = {};

      if (item[i].inventory_id) { data.inventory_id = item[i].inventory_id; }
      if (item[i].inventory_code) { data.inventory_code = item[i].inventory_code; }
      if (item[i].name) { data.name = item[i].name; }
      if (item[i].inventory_label) { data.inventory_label = item[i].inventory_label; }
      if (item[i].warehouse_id) { data.warehouse_id = item[i].warehouse_id; }
      if (item[i].ordered) { data.ordered = item[i].ordered; }
      if (item[i].orderedeqv) { data.orderedeqv = item[i].orderedeqv; }
      if (item[i].inventory_hpp) { data.inventory_hpp = item[i].inventory_hpp; }
      if (item[i].delivered) { data.delivered = item[i].delivered; }
      if (item[i].deliveredeqv) { data.deliveredeqv = item[i].deliveredeqv; }
      if (item[i].price) { data.price = item[i].buying_price; }
      if (item[i].landed_cost) { data.landed_cost = item[i].landed_cost; }
      if (item[i].discount_persent) { data.discount_persent = item[i].discount_persent; }
      if (item[i].discount_amount) { data.discount_amount = item[i].discount_amount; }
      if (item[i].uom_order) { data.uom_order = item[i].uom_order; }
      if (item[i].uom_label) { data.uom_label = item[i].uom_label; }
      if (item[i].row_order) { data.row_order = item[i].row_order; }
      if (item[i].row_label) { data.row_label = item[i].row_label; }
      if (item[i].isdelivery) { data.isdelivery = item[i].isdelivery; }
      if (item[i].tax_id) { data.tax_id = item[i].tax_id; }
      if (item[i].tax) { data.tax = item[i].tax; }
      if (item[i].delivery_schedule) { data.delivery_schedule = new Date(item[i].delivery_schedule); }
      if (item[i].delivery_note) { data.delivery_note = item[i].delivery_note; }
      if (item[i].description) { data.description = item[i].description; }
      if (item[i].oriprice) { data.oriprice = item[i].oriprice; }
      if (item[i].uom1) { data.uom1 = item[i].uom1; }
      if (item[i].uom2) { data.uom2 = item[i].uom2; }
      if (item[i].uom3) { data.uom3 = item[i].uom3; }
      if (item[i].uom2equal) { data.uom2equal = item[i].uom2equal; }
      if (item[i].uom3equal) { data.uom3equal = item[i].uom3equal; }
      if (item[i].min_price) { data.min_price = item[i].min_price; }
      if (item[i].selling_price) { data.selling_price = item[i].selling_price; }
      if (item[i].selling_price2) { data.selling_price2 = item[i].selling_price2; }
      if (item[i].selling_price3) { data.selling_price3 = item[i].selling_price3; }
      if (item[i].selling_dsc_amount) { data.selling_dsc_amount = item[i].selling_dsc_amount; }
      if (item[i].selling_dsc_amount2) { data.selling_dsc_amount2 = item[i].selling_dsc_amount2; }
      if (item[i].selling_dsc_amount3) { data.selling_dsc_amount3 = item[i].selling_dsc_amount3; }
      if (item[i].stock) { data.stock = item[i].stock }

      this.purchase_quotationsDetail.push(this.copying({
        ...this._formPurchase_quotationDetail,
        ...data
      }));

    }

    this.disableInput.reference_code= true;

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
        title: this.gen.th_transaction_dateTbl4,
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

    if (importlink == 'purchase_requests') {
      this.httpService.http_api_post('transaction/purchase_request/select', { is_use: 1, action: 1 }).subscribe((value) => {

        if (value.success) {
          this.sourceImport.load(value.data.purchase_requests);
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
    }

  }

  purchaseItemPriceDiscountCountAmount(event) {

    if (this.formPurchase_quotationDetail.value.price != 0) {
      this.formPurchase_quotationDetail({ discount_amount: this.formPurchase_quotationDetail.value.price * this.formPurchase_quotationDetail.value.discount_persent / 100 });
    } else {
      this.formPurchase_quotationDetail.patchValue({ discount_persent: 0 });
    }
  }

  purchaseItemPriceDiscountCountPersent(event) {

    if (this.formPurchase_quotationDetail.value.price != 0) {
      this.formPurchase_quotationDetail.patchValue({ discount_persent: this.formPurchase_quotationDetail.value.discount_amount / this.formPurchase_quotationDetail.value.price * 100 });
    } else {
      this.formPurchase_quotationDetail.patchValue({ discount_amount: 0 });
    }
  }

  businessPartneraddress: any = [];
  getBusinesspartneraddress() {
    this.businessPartneraddress = JSON.parse("[]");
    console.log(this.formPurchase_quotation.value.businesspartner_id);
    if (this.formPurchase_quotation.value.businesspartner_id != '') {
      this.httpService.http_api_post('company/businesspartner/addresslist', { businesspartner_id: this.formPurchase_quotation.value.businesspartner_id })
        .subscribe((value) => {

          if (value.success) {
            this.businessPartneraddress = value.data.address;
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    }
  }

  businesspartnerAddressSelect(address) {
    this.formPurchase_quotation.patchValue({ delivery_address: address });
  }

  selectedCustomer(event) {

    this.formPurchase_quotation.patchValue({
      discount_date: event.discount_date,
      due_date: event.due_date,
      early_discount: event.early_discount,
      late_charge: event.late_charge,
    })

    this._formPurchase_quotation.discount_date = event.discount_date;
    this._formPurchase_quotation.due_date = event.due_date;
    this._formPurchase_quotation.early_discount = event.early_discount;
    this._formPurchase_quotation.late_charge = event.late_charge;
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
