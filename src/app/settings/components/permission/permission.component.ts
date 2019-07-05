import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { validateConfig } from '@angular/router/src/config';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'permission',
  templateUrl: './permission.html',
})
export class Permission {

  @ViewChild('childModal') public childModal: ModalDirective;

  formpermission: any;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formpermission = { app_permission_group_id: '', app_permission_group_code: '', app_permission_group: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formpermission = this.formBuilder.group({ //sssss
      app_permission_group_id: '',
      app_permission_group_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      app_permission_group: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
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
    console.log('this.formpermission');
    console.log(this.formpermission);
  }

  gen: any = { "app_component_id": 0, "_title": "General permission", "_code": "General permission Code", "_titleModal1": "Title Modal", "ph_permission_no": "permission Code", "ph_description": "Description", "ph_name": "Name", "ph_depreciation_method_id": "Depreciation Method", "ph_straight_line": "Garis Lurus", "ph_downline_ballance": "Saldo Menurun", "ph_max_years": "Max years", "at_app_permission_group_code": "permission Code", "at_account_id": "Account", "at_depreciation_id": "Depreciation Account", "at_acumulated_id": "Acumulated Account", "at_description": "Description", "at_name": "Name", "at_max_years": "Max years", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "ClearAll", "btn_closeModal1": "Close", "th_app_permission_group_code": "permission Code", "th_description": "Description", "td_select": "Select" };

  ngOnInit() {
    if (this.httpService.is_authorization) {
      this.getGen();
    } else {
      this.httpService.authorization(true).then(value => {
        this.getGen();
      });
    }
  }


  getGen() {
    this.httpService.getTranslate('74').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.settings2 = Object.assign({}, this.mySettings2());
          this.currentUser = this.httpService.currentUser;
          this.getpermissionOptions();
          this.disableInput.app_permission_group_code = true;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  ngOnDestroy() {

  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  permissionList: any = [];

  getpermissionOptions() {

    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 1 }).subscribe((value) => {

      if (value.success) {
        this.permissionList = value.data.account;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  permissionParse;
  submitFormpermission() {

    this.permissionParse = this.copying(this.formpermission.getRawValue());
    this.permissionParse.update_by = this.httpService.currentUser.employee_id;
    this.permissionParse.update_datetime = new Date();

    if (this.formpermission.value.app_permission_group_id == '') {

      this.permissionParse.create_by = this.httpService.currentUser.employee_id;
      this.permissionParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/permission/group', this.permissionParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.permissionParse.app_permission_group_id = value.data.app_permission_group_id;
            this.permissionParse.app_permission_group_code = value.data.app_permission_group_code;
            this.setPermission(this.permissionParse);

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updatepermission();
    }
  }

  deletepermission() {

    if (confirm("Are you sure to delete this data?")) {
      this.formpermission.patchValue({ is_active: 0 });
      this.submitFormpermission();
    }

  }

  updatepermission() {

    this.httpService.http_api_put('apps/permission/group', this.permissionParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.setPermission(this.permissionParse);
          if (this.formpermission.value.is_active == 0) {
            this.clearAll();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  outputClearall: string = '';
  clearAll() {
    this.httpService.d = new Date();
    this.setPermission(this.formpermission.getRawValue());
    this.outputClearall = Math.random().toString();
  }

  modalShow() {
    this.ModalHeader = 'List permission';
    this.ModalGetpermission();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setPermission(this.ModalSelectedpermission);
    this.modalHide();
  }

  public Modalpermission: any = [];
  public ModalHeader: string;
  public ModalSelectedpermission: any;

  ModalGetpermission() {

    this.Modalpermission = JSON.parse("[]");
    this.httpService.http_api_post('apps/permission/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {

        this.Modalpermission = value.data.permission;
        this.source.load(this.Modalpermission);

      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectpermission(item) {
    item.data.account_id = "" + item.data.account_id + "";
    item.data.depreciation_id = "" + item.data.depreciation_id + "";
    item.data.acumulated_id = "" + item.data.acumulated_id + "";

    this.ModalSelectedpermission = item.data;
    this.modalOut();
    this.modalHide();

  }

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
        app_permission_group_code: {
          title: this.gen.th_app_permission_group_code,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.th_description,
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

  setPermission(value) {

    this.formpermission.patchValue(this.copying(value));
    if (value.app_permission_group_id == 1) {
      this.disableInput.app_permission_group = true;
      this.disableInput.description = true;
    } else {
      this.disableInput.app_permission_group = false;
      this.disableInput.description = false;
    }

    this.source2.load([]);

    if (this.formpermission.value.app_permission_group_id != '') {
      this.getPermissionDetail();
    }

  }

  getPermissionDetail() {

    this.httpService.http_api_put('apps/permission/select', { app_permission_group_id: this.formpermission.value.app_permission_group_id, employee_id: this.httpService.currentUser.employee_id }).subscribe((value) => {
      if (value.success) {

        this.source2.load(value.data.permissionDetail);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  settings2 : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings2() {
    return {
      actions: {
        add: false,
        edit: false,
      },
      mode: 'inline',
      delete: {
        deleteButtonContent: '<button ngClass="status-button btn btn-sm btn-warning">' + this.gen.at_change + '</button>',
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        value: {
          title: this.gen.th_value,
          show: 1,
          width: '100px',
          editor: {
            type: 'checkbox',
            config: {
              true: 'Yes',
              false: 'No'
            }
          },
        },
        component_label: {
          title: this.gen.th_label,
          type: 'string',
          editable: false,
          show: 1
        },
        description: {
          title: this.gen.th_description,
          type: 'string',
          editable: false,
          show: 1
        },
      })
    }
  };
  source2: LocalDataSource = new LocalDataSource();

  deleteConfirm(value) {
    console.log(value)
    this.httpService.http_api_post('apps/permission/component', value.data)
      .subscribe((value) => {
        if (value.success) {
          this.getPermissionDetail();

          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          value.confirm.reject();
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
          value.confirm.reject();
        }
      });


  }

}
