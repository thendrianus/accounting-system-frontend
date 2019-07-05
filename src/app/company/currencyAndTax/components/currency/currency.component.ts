import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'currency',
  styleUrls: ['./currency.scss'],
  templateUrl: './currency.html',
})
export class Currency {

  currentUser: any = { employee_job_id: 0 };

  formCurrency;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formCurrency = { currency_id: '', currency_order: '', currencies: '', rate: '', symbol: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formCurrency = this.formBuilder.group({ //sssss
      currency_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      currency_order: '',
      currencies: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      rate: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      symbol: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formCurrency');
    console.log(this.formCurrency);
  }


  checkCurrencyId() {
    if (this.formCurrency.value.currency_order != '') {
      this.disableInput.currency_id = true;
    } else {
      this.disableInput.currency_id = false;
    }
  }

  gen: any = { "app_component_id": 0, "_title": "Currency", "ph_currency_id": "Currency Code", "ph_currency": "currency", "ph_rate": "Rate", "ph_symbol": "Symbol", "ph_description": "Description", "at_currency_id": "Currency Code", "at_currency": "currency", "at_rate": "Rate", "at_symbol": "Symbol", "at_description": "Description", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Cancel", "btn_clear": "Clear All", "th_action": "Action", "th_currency_id": "Currency Code", "th_currency": "Currency", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('7').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getCurrency();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  currencyCategoryData: any = [];

  currencyData: any = [];
  getCurrency() {
    this.httpService.http_api_post('apps/currency/select', { is_use: '0' })
      .subscribe((value) => {

        if (value.success) {
          this.currencyData = value.data.currency;
          this.currencyCategoryData = value.data.category;
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  currencyParse: any;
  currencySubmit() {

    this.currencyParse = this.copying(this.formCurrency.getRawValue());
    this.currencyParse.update_by = this.httpService.currentUser.employee_id;
    this.currencyParse.update_datetime = new Date();

    if (this.currencyParse.currency_order == '') {
      this.currencyParse.create_by = this.httpService.currentUser.employee_id;
      this.currencyParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/currency', this.currencyParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formCurrency.patchValue({
              ...this.copying(this.currencyParse),
              currency_order: value.data.currency_order
            })

            this.getCurrency();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

          this.checkCurrencyId();

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {

      this.saveUpdate();
    }

  }

  saveUpdate() {

    this.httpService.http_api_put('apps/currency', this.currencyParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formCurrency.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formCurrency.patchValue({ ...this.copying(this.currencyParse) });
          }
          this.getCurrency();
          this.checkCurrencyId();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  currencyDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formCurrency.patchValue({ is_active: 0 });
      this.currencySubmit();
    }
  }

  clearAll() {
    this.formCurrency.reset(this._formCurrency);
    this.checkCurrencyId();
  }

  editCurrency(item) {
    item.rate = "" + item.rate + "";
    this.formCurrency.patchValue({ ...this.copying(item) });
    this.checkCurrencyId();
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getCurrency();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
