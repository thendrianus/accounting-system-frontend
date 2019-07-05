import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'brand',
  styleUrls: ['./brand.scss'],
  templateUrl: './brand.html',
})
export class Brand {

  public brands: any = [];

  formBrand;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formBrand = { brand_id: '', brand_code: '', brand: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formBrand = this.formBuilder.group({ //sssss
      brand_id: '',
      brand_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      brand: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formBrand');
    console.log(this.formBrand);
  }


  loadBrand() {
    this.httpService.http_api_post('apps/brand/select', { is_use: '0' })
      .subscribe((value) => {
        if (value.success) {
          this.brands = value.data.brand;
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  gen: any = { "app_component_id": 0, "_title": "Brand", "_code": "Brand Code", "ph_brand": "Brand", "ph_description": "Description", "at_brand": "Brand", "at_description": "Description", "btn_add": "Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_clear": "Clear All", "th_action": "Action", "th_no": "No", "th_brand": "Brand", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('23').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.loadBrand();
          this.disableInput.brand_code = true;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  selectBrand(item) {
    this.formBrand.patchValue({ ...this.copying(item) });
  }

  brandParse: any = {};
  formSubmit() {

    this.brandParse = this.copying(this.formBrand.getRawValue());

    this.brandParse.update_by = this.httpService.currentUser.employee_id;
    this.brandParse.update_datetime = new Date();

    if (this.formBrand.value.brand_id == '') {
      this.brandParse.create_by = this.httpService.currentUser.employee_id;
      this.brandParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/brand', this.brandParse)
        .subscribe((value) => {
          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.brandParse.brand_code = value.data.brand_code;
            this.brandParse.brand_id = value.data.lastId;
            this.formBrand.patchValue({ ...this.copying(this.brandParse) });
            this.loadBrand();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateBrand();
    }
  }

  updateBrand() {
    this.httpService.http_api_put('apps/brand', this.brandParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formBrand.value.is_active == 0) {
            this.clearAll();
          }
          this.loadBrand();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  deleteBrand() {
    if (confirm("Are you sure to delete this data?")) {
      this.formBrand.patchValue({ is_active: 0 });
      this.formSubmit();
    }
  }

  clearAll() {
    this.formBrand.reset(this._formBrand);
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.loadBrand();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
