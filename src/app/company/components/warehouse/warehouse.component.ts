import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'warehouse',
  styleUrls: ['./warehouse.scss'],
  templateUrl: './warehouse.html',
})
export class Warehouse {

  formWarehouse;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formWarehouse = { warehouse_id: '', warehouse_code: '', warehouse: '', warehouse_category_id: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formWarehouse = this.formBuilder.group({ //sssss
      warehouse_code: '',
      warehouse_id: '',
      warehouse: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      warehouse_category_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
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
    console.log('this.formWarehouse');
    console.log(this.formWarehouse);
  }

  gen: any = { "app_component_id": 0, "_title": "Warehouse", "_code": "Warehouse Code", "ph_warehouse_code": "Warehouse Code", "ph_warehouse": "Warehouse", "ph_description": "Description", "at_warehouse_code": "Warehouse Code", "at_warehouse": "Warehouse", "at_category": "Category", "at_description": "Description", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Cancel", "btn_clear": "Clear All", "th_action": "Action", "th_warehouse": "Warehouse", "th_category": "Category", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('14').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.warehouse_code = true;
          this.getWarehouse();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  warehouseCategoryData: any = [];

  warehouseData: any = [];
  getWarehouse() {
    this.httpService.http_api_post('apps/warehouse/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.warehouseData = value.data.warehouse;
        this.warehouseCategoryData = value.data.category;
        if (this.warehouseCategoryData.length > 0 && this.formWarehouse.value.warehouse_category_id == '') {
          this.formWarehouse.patchValue({ warehouse_category_id: this.warehouseCategoryData[0].value });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  warehouseParse: any;
  warehouseSubmit() {

    this.warehouseParse = this.copying(this.formWarehouse.getRawValue());
    this.warehouseParse.update_by = this.httpService.currentUser.employee_id;
    this.warehouseParse.update_datetime = new Date();

    if (this.warehouseParse.warehouse_id == '') {
      this.warehouseParse.create_by = this.httpService.currentUser.employee_id;
      this.warehouseParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/warehouse', this.warehouseParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formWarehouse.patchValue({
              ...this.copying(this.warehouseParse),
              warehouse_id: value.data.warehouse_id
            })
            this.getWarehouse();
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

    this.httpService.http_api_put('apps/warehouse', this.warehouseParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formWarehouse.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formWarehouse.patchValue({ ...this.copying(this.warehouseParse) });
          }
          this.getWarehouse();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  warehouseDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formWarehouse.patchValue({ is_active: 0 });
      this.warehouseSubmit();
    }
  }

  clearAll() {
    this.formWarehouse.reset(this._formWarehouse);
  }

  editWarehouse(item) {
    item.warehouse_category_id = "" + item.warehouse_category_id + "";
    this.formWarehouse.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getWarehouse();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
