import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'tax',
  styleUrls: ['./tax.scss'],
  templateUrl: './tax.html',
})
export class Tax {

  formTax;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formTax = { tax_id: '', in_account_id: '', out_account_id: '', name: '', percentage: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formTax = this.formBuilder.group({ //sssss
      tax_id: '',
      in_account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      out_account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      percentage: ['', [Validators.required, Validators.minLength(0), Validators.maxLength(20)]],
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
    console.log('this.formTax');
    console.log(this.formTax);
  }

  gen: any = { "app_component_id": 0, "_title": "Tax", "ph_tax_id": "Tax", "ph_name": "Name", "ph_persentage": "Persentage", "at_tax_id": "Tax", "at_name": "Name", "at_account_id": "Account", "at_persentage": "Persentage", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Cancel", "btn_clear": "Clear All", "th_action": "Action", "th_name": "Name", "th_persentage": "Persentage", "th_account": "Account", "td_edit": "Edit" };

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
    this.httpService.getTranslate('12').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getAccountData();
          this.getTax();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  taxData: any = [];
  getTax() {
    this.httpService.http_api_post('apps/tax/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.taxData = value.data.tax;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  taxParse: any;
  taxSubmit() {

    this.taxParse = this.copying(this.formTax.getRawValue());
    this.taxParse.update_by = this.httpService.currentUser.employee_id;
    this.taxParse.update_datetime = new Date();

    if (this.taxParse.tax_id == '') {
      this.taxParse.create_by = this.httpService.currentUser.employee_id;
      this.taxParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/tax', this.taxParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formTax.patchValue({
              ...this.copying(this.taxParse),
              tax_id: value.data.tax_id
            })
            this.getTax();
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

    this.httpService.http_api_put('apps/tax', this.taxParse)
      .subscribe((value) => {
        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formTax.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formTax.patchValue({ ...this.copying(this.taxParse) });
          }
          this.getTax();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  taxDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formTax.patchValue({ is_active: 0 });
      this.taxSubmit();
    }
  }

  clearAll() {
    this.formTax.reset(this._formTax);
  }

  accountData: any = [];
  getAccountData() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.accountData = value.data.account;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  editTax(item) {
    item.in_account_id = "" + item.in_account_id + "";
    item.out_account_id = "" + item.out_account_id + "";
    this.formTax.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getTax();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
