import { Component, HostListener } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'inventory_group',
  styleUrls: ['./inventory_group.scss'],
  templateUrl: './inventory_group.html',
})
export class Inventory_group {
  public inventory_groups: any = [];

  formInventory_group;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formInventory_group = { inventory_group_id: '', inventory_group_code: '', inventory_group: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, issale: 1, ispurchase: 1, isfix_asset: 1, }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formInventory_group = this.formBuilder.group({ //sssss
      inventory_group_id: '',
      inventory_group_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      inventory_group: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      issale: [1, [Validators.minLength(0), Validators.maxLength(15)]],
      ispurchase: [1, [Validators.minLength(0), Validators.maxLength(15)]],
      isfix_asset: [1, [Validators.minLength(0), Validators.maxLength(15)]],
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formInventory_group');
    console.log(this.formInventory_group);
  }

  loadInventory_group() {
    this.httpService.http_api_post('apps/inventory_group/select', { is_use: '0' })
      .subscribe((value) => {
        if (value.success) {
          this.inventory_groups = value.data.inventory_group;
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  gen: any = { "app_component_id": 0, "_title": "Inventory_group", "_code": "Inventory_group Code", "ph_inventory_group": "Inventory_group", "ph_description": "Description", "at_inventory_group": "Inventory_group", "at_description": "Description", "btn_add": "Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_clear": "Clear All", "th_action": "Action", "th_no": "No", "th_inventory_group": "Inventory_group", "th_description": "Description", "td_select": "Select" };

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
    this.httpService.getTranslate('65').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.loadInventory_group();
          this.disableInput.inventory_group_code = true;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  selectInventory_group(item) {
    this.formInventory_group.patchValue({ ...this.copying(item) });
  }

  inventory_groupParse: any = {};
  formSubmit() {


    this.inventory_groupParse = this.copying(this.formInventory_group.getRawValue());

    this.inventory_groupParse.update_by = this.httpService.currentUser.employee_id;
    this.inventory_groupParse.update_datetime = new Date();

    if (this.formInventory_group.value.inventory_group_id == '') {
      this.inventory_groupParse.create_by = this.httpService.currentUser.employee_id;
      this.inventory_groupParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/inventory_group', this.inventory_groupParse)
        .subscribe((value) => {
          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.inventory_groupParse.inventory_group_code = value.data.inventory_group_code;
            this.inventory_groupParse.inventory_group_id = value.data.lastId;
            this.formInventory_group.patchValue({
              ...this.copying(this.inventory_groupParse)
            });
            this.loadInventory_group();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateInventory_group();
    }
  }

  updateInventory_group() {
    this.httpService.http_api_put('apps/inventory_group', this.inventory_groupParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formInventory_group.value.is_active == 0) {
            this.clearAll();
          }
          this.loadInventory_group();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  deleteInventory_group() {
    if (confirm("Are you sure to delete this data?")) {
      this.formInventory_group.patchValue({ is_active: 0 });
      this.formSubmit();
    }
  }

  clearAll() {
    this.formInventory_group.reset(this._formInventory_group);
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.loadInventory_group();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
