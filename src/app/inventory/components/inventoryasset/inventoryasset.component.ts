import { Component, Input, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { HttpService } from '../../../';
// import { UploaderOptions } from 'ngx-uploader';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'inventoryasset',
  styleUrls: ['./inventoryasset.scss'],
  templateUrl: './inventoryasset.html',
})
export class Inventoryasset {

  @ViewChild('childModal') public childModal: ModalDirective;

  public inventoryParse: any = {};
  formInventory: any;
  formInventoryPrice: any;
  formInventorySupplier: any;
  currentUser: any = { employee_job_id: 0 };

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

  @Input() inventoryCategory: any = { inventory_category_id: '', category: '' };

  public defaultPicture = 'assets/img/no-photo.png';

  // public uploaderOptions: UploaderOptions = {
  //   url: this.httpService.baseUrl + 'file',
  //   filterExtensions: true,
  //   allowedExtensions: ['jpg', 'png'],
  //   maxSize: 2097152,
  // };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formInventory = { inventory_id: '', inventory_code: '', name: '', hpp_type: '1', description: '-', brand_id: '', inventory_group_id: '', uom1: '-', uom2: '-', uom3: '-', uom2equal: 1, uom3equal: 1, inventory_image: '', currency_id: 'IDR', buying_price: 0, selling_price: 0, selling_dsc_amount: 0, selling_dsc_persent: 0, stock: '0', inventory_detail_category_id: '1', inventory_category_id: '1', label: '1', min_stock: 1, max_stock: 1000, purchase_tax_id: '', sell_tax_id: '', issale: 1, ispurchase: 1, isfix_asset: 1, purchase_account_id: '', sell_account_id: '', hpp_account_id: '', create_by: '-', update_by: '-', create_datetime: '', update_datetime: '', is_use: 1, is_active: 1, auto_inventory_code: true, if_auto_inventory_code: false }
  _formInventoryPrice = { inventory_price_id: '', inventory_id: '', price_name: '', uom: '', quantity: 1, price: 0, discount_amount: 0, discount_persent: 0, description: '-', create_by: '-', update_by: '-', create_datetime: '', update_datetime: '', is_use: 1, is_active: 1 }
  _formInventorySupplier = { inventory_supplier_id: '', inventory_id: '', businesspartner_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: '', update_datetime: '', is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;

  constructor(
    public formBuilder: FormBuilder,
    protected httpService: HttpService,
    private sanitized: DomSanitizer
  ) {

    this.formInventory = this.formBuilder.group({ //sssss
      inventory_id: '',
      inventory_code: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      hpp_type: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      brand_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      inventory_group_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      uom1: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      uom2: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      uom3: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      uom2equal: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      uom3equal: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      inventory_image: '',
      currency_id: 'IDR',
      buying_price: [0],
      selling_price: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      selling_dsc_amount: [0, [Validators.required, Validators.minLength(0), Validators.maxLength(15)]],
      selling_dsc_persent: [0, [Validators.required, Validators.minLength(0), Validators.maxLength(3)]],
      stock: '0',
      inventory_detail_category_id: '1',
      inventory_category_id: '1',
      label: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      min_stock: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      max_stock: [1000, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      purchase_tax_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      sell_tax_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      issale: [1, [Validators.minLength(0), Validators.maxLength(15)]],
      ispurchase: [1, [Validators.minLength(0), Validators.maxLength(15)]],
      isfix_asset: [1, [Validators.minLength(0), Validators.maxLength(15)]],
      purchase_account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      sell_account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      hpp_account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      create_by: '-',
      update_by: '-',
      create_datetime: '',
      update_datetime: '',
      is_use: 1,
      is_active: 1,
      auto_inventory_code: true,
      if_auto_inventory_code: false
    });

    this.formInventoryPrice = this.formBuilder.group({ //sssss
      inventory_price_id: '',
      inventory_id: '',
      price_name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      discount_amount: [0],
      discount_persent: [0],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: '',
      update_datetime: '',
      is_use: 1,
      is_active: 1
    });

    this.formInventorySupplier = this.formBuilder.group({ //sssss
      inventory_supplier_id: '',
      inventory_id: '',
      businesspartner_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: '',
      update_datetime: '',
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
    console.log('this.formInventory');
    console.log(this.formInventory);
    console.log('this.formInventoryPrice');
    console.log(this.formInventoryPrice);
    console.log('this.formInventorySupplier');
    console.log(this.formInventorySupplier);
  }

  gen: any = { "app_component_id": 0, "_title": "Inventory", "_code": "Inventory Code", "ph_code": "Inventory Code", "ph_name": "Name", "ph_description": "Description", "ph_uom1": "Unit Of Measurement 1", "ph_uom2": "Unit Of Measurement 2", "ph_uom2equal": "UOM 2 Equal", "ph_uom3": "Unit Of Measurement 3", "ph_uom3equal": "UOM 2 Equal", "ph_selling_price": "Selling Price", "ph_selling_dsc_amount": "Min Selling Price", "ph_search_label": "Search Label", "ph_min_stock": "Min Stock", "ph_max_stock": "Max Stock", "at_code": "Inventory Code", "at_name": "Name", "at_image": "Image", "at_description": "Description", "at_brand": "Brand", "at_inventory_group": "Group", "at_currency": "Currency", "at_uom1": "Unit Of Measurement 1", "at_uom2": "Unit Of Measurement 2", "at_uom2equal": "UOM 2 Equal", "at_uom3": "Unit Of Measurement 3", "at_uom3equal": "UOM 2 Equal", "at_selling_price": "Selling Price", "at_selling_dsc_amount": "Min Selling Price", "at_category": "Inventory Category", "at_search_label": "Search Label", "at_min_stock": "Min Stock", "at_max_stock": "Max Stock", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_clear": "Clear", "btn_search": "Search", "th_code": "Inventory Code", "th_name": "Name", "th_brand": "Brand", "th_inventory_group": "Brand", "td_select": "Select" };

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
    this.httpService.getTranslate('15').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this._formInventory.currency_id = this.httpService.defaultCurrency;

          this.getBrand();
          this.getUom();
          this.getGroup();
          this.getBusinesspartner();
          this.getTax();
          this.getAccount();
          this.getAccountLink();
          this.autoInventoryCodeChange(true);
          this.settings = Object.assign({}, this.mySettings());
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }


  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  setBrand(event) {
    this.formInventory.patchValue({ brand_id: event });
  }

  setGroup(event) {
    this.formInventory.patchValue({ inventory_group_id: event });
  }

  setCurrency(event) {
    this.formInventory.patchValue({ currency_id: event });
    this._formInventory.currency_id = event;
    this.moneyOption.prefix = event + '. ';
  }

  setInventorydetailcategory(event) {
    this.formInventory.patchValue({ inventory_detail_category_id: event });
  }

  clearAll() {
    this.setInventory(false);
    this.clearAllInventoryPrice();
    this.inventoryPrices = JSON.parse("[]");
    this.clearAllInventorySupplier();
    this.inventorySuppliers = JSON.parse("[]");
  }

  autoInventoryCodeChange(istrue) {
    if (this.formInventory.value.auto_inventory_code) {
      if (istrue) {
        this.formInventory.patchValue({ inventory_code: '' });
      }
      this.disableInput.inventory_code = true;
    } else {
      this.disableInput.inventory_code = false;
    }
  }

  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload inventory_image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      this.formInventory.patchValue({ inventory_image: JSON.parse(data.response)[0].filename });
    }

  }

  inventoryAdd() {

    this.formInventory.patchValue({ inventory_category_id: this.inventoryCategory.inventory_category_id });

    this.inventoryParse = this.copying(this.formInventory.getRawValue());
    this.inventoryParse.create_by = this.httpService.currentUser.employee_id;
    this.inventoryParse.update_by = this.httpService.currentUser.employee_id;

    if (this.formInventory.value.inventory_id == '') {
      this.httpService.http_api_post('inventory/inventory', this.inventoryParse)
        .subscribe((value) => {

          if (value.success) {

            this.inventoryParse.inventory_id = value.data.lastId;
            this.inventoryParse.inventory_code = value.data.inventory_code;

            this.setInventory(this.inventoryParse);
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };

            this.clearAllInventoryPrice();
            this.getInventoryPrice();
            this.clearAllInventorySupplier();
            this.getInventorySupplier();
            
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.inventoryUpdate();
    }
  }

  inventoryUpdate() {

    this.inventoryParse = this.copying(this.formInventory.getRawValue());
    this.inventoryParse.update_by = this.httpService.currentUser.employee_id;
    this.httpService.http_api_put('inventory/inventory', this.inventoryParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formInventory.value.is_active == 0) {
            this.clearAll();
          }
          this.clearAllInventoryPrice();
          this.getInventoryPrice();
          this.clearAllInventorySupplier();
          this.getInventorySupplier();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  inventoryDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formInventory.patchValue({ is_active: 0 });
      this.inventoryUpdate();
    }
  }

  modalShow() {

    this.ModalHeader = 'List ' + this.inventoryCategory.category;
    this.ModalInventoryCategory = this.inventoryCategory;

    this.ModalGetInventory();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut(data) {

    this.setInventory(data)

    this.clearAllInventoryPrice();
    this.getInventoryPrice();
    this.clearAllInventorySupplier();
    this.getInventorySupplier();

    // this.autoInventoryCodeChange(false);
    // this.modalHide();
  }

  setInventory(data) {
    if (data) {
      this.formInventory.patchValue({ ...this.copying(data) });
    } else {
      this.formInventory.reset(this._formInventory)
    }

    if (this.formInventory.value.inventory_id == '') {
      this.disableInput.hpp_type = false;
    } else {
      this.disableInput.hpp_type = true;
    }
  }

  public ModalInventory: any = [];
  public ModalHeader: string;
  public ModalSelectedInventory: string = '';
  public ModalInventoryCategory: any = { inventory_category_id: '', category: '' };

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        add: false,
        edit: false,
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.td_select}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        inventory_code: {
          title: this.gen.tn_code,
          type: 'string',
          show: this.gen.ts_code,
        },
        name: {
          title: this.gen.tn_name,
          type: 'string',
          show: this.gen.ts_name,
        },
        brand: {
          title: this.gen.tn_brand,
          type: 'string',
          show: this.gen.ts_brand
        },
        inventory_group: {
          title: this.gen.tn_inventory_group,
          type: 'string',
          show: this.gen.ts_inventory_group
        },
        buying_price: {
          title: 'Buying Price',
          type: 'string',
          show: 'Buying Price'
        },
        selling_price: {
          title: this.gen.tn_selling_price,
          type: 'string',
          show: this.gen.ts_selling_price
        },
        selling_dsc_amount: {
          title: this.gen.tn_selling_dsc_amount,
          type: 'string',
          show: this.gen.ts_selling_dsc_amount
        },
        inventory_hpp: {
          title: this.gen.tn_inventory_hpp,
          type: 'string',
          show: this.gen.ts_inventory_hpp
        },
        inventory_detail: {
          title: this.gen.tn_inventory_detail,
          type: 'string',
          show: this.gen.ts_inventory_detail
        },
        label: {
          title: this.gen.tn_label,
          type: 'string',
          show: this.gen.ts_label
        },
        stock: {
          title: this.gen.tn_stock,
          type: 'string',
          show: this.gen.ts_stock
        },
        min_stock: {
          title: this.gen.tn_min_stock,
          type: 'string',
          show: this.gen.ts_min_stock
        },
        max_stock: {
          title: this.gen.tn_max_stock,
          type: 'string',
          show: this.gen.ts_max_stock
        },
        uom1: {
          title: this.gen.tn_uom1,
          type: 'string',
          show: this.gen.ts_uom1
        },
        uom2: {
          title: this.gen.tn_uom2,
          type: 'string',
          show: this.gen.ts_uom2
        },
        uom3: {
          title: this.gen.tn_uom3,
          type: 'string',
          show: this.gen.ts_uom3
        },
      }),
      pager: {
        perPage: 75
      }
    }
  }

  source: LocalDataSource = new LocalDataSource();

  ModalGetInventory() {
    this.ModalInventory = JSON.parse("[]");
    this.httpService.http_api_post('inventory/inventory/search', { inventory_category_id: this.ModalInventoryCategory.inventory_category_id, is_use: 0, is_action: 0 }).subscribe((value) => {
      if (value.success) {

        this.ModalInventory = value.data.inventory;
        this.source.load(this.ModalInventory);

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectInventory(item) {

    item.data.brand_id = "" + item.data.brand_id + "";
    item.data.inventory_group_id = "" + item.data.inventory_group_id + "";
    item.data.purchase_tax_id = "" + item.data.purchase_tax_id + "";
    item.data.sell_tax_id = "" + item.data.sell_tax_id + "";
    item.data.purchase_account_id = "" + item.data.purchase_account_id + "";
    item.data.sell_account_id = "" + item.data.sell_account_id + "";
    item.data.hpp_account_id = "" + item.data.hpp_account_id + "";

    if (item.data.inventory_image == '') {
      item.data.oldimage = 'assets/img/no-photo.png';
    } else {
      item.data.oldimage = this.httpService.baseAssetsDisc + 'inventory/' + item.data.inventory_image;
    }

    this.modalOut(item.data);
    this.modalHide();

  }

  selectedInventorylabel(data) {

  }
  brand: any = [];
  getBrand() {
    this.httpService.http_api_post('apps/brand/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.brand = value.data.brand;
          if (this.brand.length > 0) {
            this._formInventory.brand_id = this.brand[0].value;
            this.formInventory.patchValue({ brand_id: this.brand[0].value });
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  inventoryGroup: any = [];
  getGroup() {
    this.httpService.http_api_post('apps/inventory_group/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.inventoryGroup = value.data.inventory_group;
          if (this.inventoryGroup.length > 0) {
            this.inventoryGroupChange(this.inventoryGroup[0]);
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  uom: any = [];
  getUom() {
    this.httpService.http_api_post('apps/uom/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.uom = value.data.uom;
          if (this.uom.length > 0) {
            this._formInventory.uom1 = this.uom[0].value;
            this.formInventory.patchValue({ uom1: this.uom[0].value });
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  setMinSelling() {
    this.formInventory.patchValue({ selling_dsc_amount: this.formInventory.value.selling_price });
  }

  purchaseDiscountCountAmount(event) {
    if (this.formInventory.value.selling_price != 0) {
      this.formInventory.patchValue({ selling_dsc_amount: this.formInventory.value.selling_price * this.formInventory.value.selling_dsc_persent / 100 });
    } else {
      this.formInventory.patchValue({ selling_dsc_persent: 0 });
    }
  }

  purchaseDiscountCountPersent(event) {
    if (this.formInventory.value.selling_price != 0) {
      this.formInventory.patchValue({ selling_dsc_persent: this.formInventory.value.selling_dsc_amount / this.formInventory.value.selling_price * 100 });
    } else {
      this.formInventory.patchValue({ selling_dsc_amount: 0 });
    }
  }

  purchasePriceDiscountCountAmount(event) {

    if (this.formInventoryPrice.value.price != 0) {
      this.formInventoryPrice.patchValue({ discount_amount: this.formInventoryPrice.value.price * this.formInventoryPrice.value.discount_persent / 100 });
    } else {
      this.formInventoryPrice.patchValue({ discount_persent: 0 });
    }
  }

  purchasePriceDiscountCountPersent(event) {

    if (this.formInventoryPrice.value.price != 0) {
      this.formInventoryPrice.patchValue({ discount_persent: this.formInventoryPrice.value.discount_amount / this.formInventoryPrice.value.price * 100 });
    } else {
      this.formInventoryPrice.patchValue({ discount_amount: 0 });
    }
  }

  inventoryPriceParse;
  inventoryPriceSubmit() {

    this.inventoryPriceParse = this.copying(this.formInventoryPrice.getRawValue());
    this.inventoryPriceParse.create_by = this.httpService.currentUser.employee_id;
    this.inventoryPriceParse.update_by = this.httpService.currentUser.employee_id;
    this.inventoryPriceParse.inventory_id = this.formInventory.value.inventory_id;


    if (this.formInventoryPrice.value.inventory_price_id == '') {
      console.log(this.inventoryPriceParse)
      this.httpService.http_api_post('inventory/inventory/price', this.inventoryPriceParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formInventoryPrice.patchValue({ inventory_price_id: value.data.lastId });
            
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
          this.getInventoryPrice();
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.inventoryPriceUpdate();
    }
  }

  inventoryPriceUpdate() {

    this.httpService.http_api_put('inventory/inventory/price', this.inventoryPriceParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formInventoryPrice.value.is_active == 0) {
            this.clearAllInventoryPrice();
          }
          this.getInventoryPrice();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  inventoryPriceDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formInventoryPrice.patchValue({ is_active: 0 });
      this.inventoryPriceSubmit();
    }
  }

  clearAllInventoryPrice() {
    this.formInventoryPrice.reset(this._formInventoryPrice);
  }

  inventoryPrices: any = [];
  getInventoryPrice() {
    if (this.formInventory.value.inventory_id != '') {
      this.httpService.http_api_post('inventory/inventory/prices', { inventory_id: this.formInventory.value.inventory_id, is_use: 0 })
        .subscribe((value) => {
          if (value.success) {
            this.inventoryPrices = value.data.inventoryPrices;
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.inventoryPrices = JSON.parse("[]");
    }

  }

  editInventoryPrice(item) {
    this.formInventoryPrice.patchValue({ ...this.copying(item) });
  }

  businesspartner: any = [];
  getBusinesspartner() {
    this.httpService.http_api_post('company/businesspartner/select', { is_use: '1', businesspartner_category_id: 3 })
      .subscribe((value) => {
        if (value.success) { 
          this.businesspartner = value.data.businesspartner;
          if (this.businesspartner.length > 0) {
            this._formInventorySupplier.businesspartner_id = this.businesspartner[0].businesspartner;
            this.formInventorySupplier.patchValue({ businesspartner_id: this.businesspartner[0].businesspartner_id });
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
  }

  inventorySupplierParse;
  inventorySupplierSubmit() {

    this.inventorySupplierParse = this.copying(this.formInventorySupplier.getRawValue());
    this.inventorySupplierParse.create_by = this.httpService.currentUser.employee_id;
    this.inventorySupplierParse.update_by = this.httpService.currentUser.employee_id;
    this.inventorySupplierParse.inventory_id = this.formInventory.value.inventory_id;

    if (this.formInventorySupplier.value.inventory_supplier_id == '') {
      this.httpService.http_api_post('inventory/inventory/supplier', this.inventorySupplierParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formInventorySupplier.patchValue({ inventory_supplier_id: value.data.lastId });
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
          this.getInventorySupplier();
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.inventorySupplierUpdate();
    }
  }

  inventorySupplierUpdate() {

    this.httpService.http_api_put('inventory/inventory/supplier', this.inventorySupplierParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formInventorySupplier.value.is_active == 0) {
            this.clearAllInventorySupplier();
          }
          this.getInventorySupplier();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  inventorySupplierDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formInventorySupplier.patchValue({ is_active: 0 });
      this.inventorySupplierSubmit();
    }
  }

  clearAllInventorySupplier() {
    this.formInventorySupplier.reset(this._formInventorySupplier);
  }

  inventorySuppliers: any = [];
  getInventorySupplier() {
    if (this.formInventory.value.inventory_id != '') {
      this.httpService.http_api_post('inventory/inventory/suppliers', { inventory_id: this.formInventory.value.inventory_id, is_use: 0 })
        .subscribe((value) => {
          if (value.success) {
            this.inventorySuppliers = this.copying(value.data.inventorySuppliers);
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.inventorySuppliers = JSON.parse("[]");
    }

  }

  editInventorySupplier(item) {
    item.businesspartner_id = "" + item.businesspartner_id + "";
    this.formInventorySupplier.patchValue({ ...this.copying(item) });
  }

  taxData: any = [];
  getTax() {
    this.httpService.http_api_post('apps/tax/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.taxData = this.copying(value.data.tax);
          if (this.taxData.length > 0) {
            this._formInventory.purchase_tax_id = this.taxData[0].value;
            this.formInventory.patchValue({
              purchase_tax_id: this.taxData[0].value,
              sell_tax_id: this.taxData[0].value
            });
            this._formInventory.sell_tax_id = this.taxData[0].value;
          }
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  accountData: any = [];
  getAccount() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 })
      .subscribe((value) => {
        if (value.success) {
          this.accountData = this.copying(value.data.account);
        }
      },
        error => {
          this.notif.error = {
            title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()
          };
        });
  }

  getAccountLink() {
    this.httpService.http_api_get('accounting/accountlink/')
      .subscribe((value) => {
        if (value.success) {
          var accountlink = value.data.accountlink;
          if (accountlink.length > 0) {
            for (var key in accountlink) {
              if (accountlink[key].account_link_id == 16) { // --account_link_id 16
                this._formInventory.purchase_account_id = "" + accountlink[key].account_id + "";
                this.formInventory.patchValue({ purchase_account_id: "" + accountlink[key].account_id + "" });
              } else if (accountlink[key].account_link_id == 17) { // --account_link_id 17
                this._formInventory.sell_account_id = "" + accountlink[key].account_id + "";
                this.formInventory.patchValue({ sell_account_id: "" + accountlink[key].account_id + "" });
              } else if (accountlink[key].account_link_id == 18) { // --account_link_id 18
                this._formInventory.hpp_account_id = "" + accountlink[key].account_id + "";
                this.formInventory.patchValue({ hpp_account_id: "" + accountlink[key].account_id + "" });
              }
            }
          }
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

  inventoryGroupChange(event) {
    this._formInventory.inventory_group_id = event.value;
    this._formInventory.issale = event.issale;
    this._formInventory.ispurchase = event.ispurchase;
    this._formInventory.isfix_asset = event.isfix_asset;

    this.formInventory.patchValue({
      inventory_group_id: event.value,
      issale: event.issale,
      ispurchase: event.ispurchase,
      isfix_asset: event.isfix_asset
    })
  }

  priceQuantityChange() {
    var qty = 0
    if (this.formInventoryPrice.value.uom == 1) {
      qty = 1;
    } else if (this.formInventoryPrice.value.uom == 2) {
      qty = this.formInventory.value.uom2equal;
    } else if (this.formInventoryPrice.value.uom == 3) {
      qty = this.formInventory.value.uom3equal;
    }

    if (this.formInventoryPrice.value.quantity) {
      if (this.formInventory.value.price) {
        this.formInventoryPrice.patchValue({ price: this.formInventoryPrice.value.quantity * this.formInventory.value.price * qty });
      }
    }
  }
}
