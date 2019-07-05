import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder } from '@angular/forms';
// import { UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'employee_account',
  styleUrls: ['./employee_account.scss'],
  templateUrl: './employee_account.html',
})
export class Employee_account {

  formEmployee_account;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formEmployee_account = { employee_account_id: '', employee_account_code: '', employee_id: '', app_permission_group_id: '', oldimage: '', username: '', new_password: '', account_password: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, is_change_password: '' }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formEmployee_account = this.formBuilder.group({ //sssss
      employee_account_id: '',
      employee_account_code: ['', [Validators.minLength(0), Validators.maxLength(11)]],
      employee_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      app_permission_group_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      oldimage: '',
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      new_password: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      is_change_password: ['', [Validators.minLength(0), Validators.maxLength(20)]]
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formEmployee_account');
    console.log(this.formEmployee_account);
  }

  public defaultPicture = 'assets/img/no-photo.png';

  // public uploaderOptions: UploaderOptions = {
  //   url: this.httpService.baseUrl + 'file',
  //   filterExtensions: true,
  //   allowedExtensions: ['jpg', 'png'],
  //   maxSize: 2097152,
  // };

  gen: any = { "app_component_id": 0, "_title": "Employee Account", "_code": "Account Code", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Delete", "btn_clear": "Clear All", "at_code": "Account Code", "at_employee_id": "Employee", "at_username": "Username", "at_password": "Password", "at_picture": "Picture", "at_description": "Description", "ph_code": "Account Code", "ph_username": "Username", "ph_description": "Description", "ph_password": "Password", "th_action": "Action", "th_employee": "Employee", "th_username": "Username", "th_description": "Description", "td_edit": "Edit", "at_new_password": "New Password", "ph_new_password": "New Password", "at_is_change_password": "Change Password" };

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
    this.httpService.getTranslate('9').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.employee_account_code = true;
          this.getEmployee_account();
          this.getEmployee();
          this.getPermission();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  employeeData: any = [];
  getEmployee() {
    this.httpService.http_api_post('hrd/employee/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.employeeData = value.data.employee;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  employee_accountData: any = [];
  getEmployee_account() {
    this.httpService.http_api_post('company/employee_account/select', { is_use: '0', account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.employee_accountData = value.data.employee_account;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  employee_accountParse: any;
  employee_accountSubmit() {

    this.employee_accountParse = this.copying(this.formEmployee_account.getRawValue());
    this.employee_accountParse.update_by = this.httpService.currentUser.employee_id;
    this.employee_accountParse.update_datetime = new Date();

    if (this.employee_accountParse.employee_account_id == '') {
      this.employee_accountParse.create_by = this.httpService.currentUser.employee_id;
      this.employee_accountParse.create_datetime = new Date();

      this.httpService.http_api_post('company/employee_account', this.employee_accountParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formEmployee_account.patchValue({
              ...this.copying(this.employee_accountParse),
              employee_account_id: value.data.employee_account_id,
              employee_account_code: value.data.employee_account_code,
              account_password: ""
            })

            this.getEmployee_account();
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

    this.httpService.http_api_put('company/employee_account', this.employee_accountParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formEmployee_account.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formEmployee_account.patchValue({ ...this.copying(this.employee_accountParse) });
            if (this.formEmployee_account.value.is_change_password) {
              this.formEmployee_account.patchValue({
                is_change_password: 0,
                new_password: "",
                account_password: ""
              })
            }
          }
          this.getEmployee_account();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  employee_accountDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formEmployee_account.patchValue({ is_active: 0 });
      this.employee_accountSubmit();
    }
  }

  clearAll() {
    this.formEmployee_account.reset(this._formEmployee_account);
  }

  editEmployee_account(item) {
    console.log(item);
    if (item.image == '') {
      item.oldimage = 'assets/img/no-photo.png';
    } else {
      item.oldimage = this.httpService.baseAssetsDisc + 'employee/' + item.profile_picture;
    }

    item.employee_id = "" + item.employee_id + "";
    this.formEmployee_account.patchValue({ ...this.copying(item) });
  }

  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      this.formEmployee_account.patchValue({ profile_picture: JSON.parse(data.response)[0].filename });
    }

  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
          this.getEmployee_account();
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

  employeeChange(event) {
    if (event.picture != '') {
      this.formEmployee_account.patchValue({
        oldimage: this.httpService.baseAssetsDisc + 'employee/' + event.picture,
        profile_picture: event.picture
      })
    }
  }

  isChangePasswordChange() {
    if (!this.formEmployee_account.valuet.is_change_password) {
      this.formEmployee_account.patchValue({ new_password: "" });
    }
  }

  permissionData: any = [];

  getPermission() {
    this.httpService.http_api_post('apps/permission/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.permissionData = value.data.permission;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

}
