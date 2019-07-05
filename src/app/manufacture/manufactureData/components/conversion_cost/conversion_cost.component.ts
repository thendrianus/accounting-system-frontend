import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'conversion_cost',
  styleUrls: ['./conversion_cost.scss'],
  templateUrl: './conversion_cost.html',
})
export class Conversion_cost {

  formConversion_cost;
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

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formConversion_cost = { conversion_cost_id: '', conversion_cost_code: '', currency_id: '', conversion_cost: '', cost: '', uom: '', account_id: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formConversion_cost = this.formBuilder.group({ //sssss
      conversion_cost_id: '',
      conversion_cost_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      currency_id: '',
      conversion_cost: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      cost: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
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
    console.log('this.formConversion_cost');
    console.log(this.formConversion_cost);
  }


  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "Conversion Cost", "_code": "Convesion Cost Code", "ph_code": "Conversion Cost Code", "ph_conversion_cost": "Conversion Cost", "ph_cost": "Cost", "ph_description": "Description", "at_code": "Conversion Cost Code", "at_conversion_cost": "Conversion Cost", "at_cost": "Cost", "at_uom": "UOM", "at_account": "Account", "at_description": "Description", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_clear": "Clear All", "th_action": "Action", "th_conversion Cost": "Conversion Cost", "th_cost": "Cost", "th_uom": "UOM", "th_account": "Account", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('27').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.conversion_cost_code = true;
          this.getConversion_cost();
          this.getAccountData();
          this.getUomData();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  conversion_costData: any = [];
  getConversion_cost() {
    this.httpService.http_api_post('manufacture/conversion_cost/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.conversion_costData = value.data.conversion_cost;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  conversion_costParse: any;
  conversion_costSubmit() {

    this.conversion_costParse = this.copying(this.formConversion_cost.getRawValue());
    this.conversion_costParse.update_by = this.httpService.currentUser.employee_id;
    this.conversion_costParse.update_datetime = new Date();

    if (this.conversion_costParse.conversion_cost_id == '') {
      this.conversion_costParse.create_by = this.httpService.currentUser.employee_id;
      this.conversion_costParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/conversion_cost', this.conversion_costParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formConversion_cost.patchValue({
              ...this.copying(this.conversion_costParse),
              conversion_cost_id: value.data.conversion_cost_id,
              conversion_cost_code: value.data.conversion_cost_code
            })
            this.getConversion_cost();
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

    this.httpService.http_api_put('manufacture/conversion_cost', this.conversion_costParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formConversion_cost.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formConversion_cost.patchValue(this.copying(this.conversion_costParse));
          }
          this.getConversion_cost();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  conversion_costDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formConversion_cost.patchValue({ is_active: 0 });
      this.conversion_costSubmit();
    }
  }

  clearAll() {
    this.formConversion_cost.reset(this._formConversion_cost);
  }

  editConversion_cost(item) {

    item.account_id = "" + item.account_id + "";
    this.formConversion_cost.patchValue(this.copying(item));
  }

  accountData: any = [];
  getAccountData() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.accountData = value.data.account;
        if (this.accountData.length > 0) {
          this.formConversion_cost.patchValue({ account_id: this.accountData[0].value });
        }
      }

    });
  }

  uomData: any = [];
  getUomData() {
    this.httpService.http_api_post('apps/uom/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.uomData = value.data.uom;
        if (this.uomData.length > 0) {
          this.formConversion_cost.patchValue({ uom: this.uomData[0].value });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  setCurrencyData(event) {
    this._formConversion_cost.currency_id = event.currency_id;
    this.formConversion_cost.patchValue({
      currency_id: event.currency_id
    })

    this.moneyOption.prefix = event.currency_id + '. ';
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getConversion_cost();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
