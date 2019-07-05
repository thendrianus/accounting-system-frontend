import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'department',
  styleUrls: ['./department.scss'],
  templateUrl: './department.html',
})
export class Department {

  formDepartment;
  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formDepartment = { department_id: '', department_code: '', department: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formDepartment = this.formBuilder.group({ //sssss
      department_id: '',
      department_code: ['', [Validators.minLength(0), Validators.maxLength(11)]],
      department: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formDepartment');
    console.log(this.formDepartment);
  }

  gen: any = { "app_component_id": 0, "_title": "Department", "ph_code": "Department Code", "ph_department": "Deparment", "ph_description": "Description", "at_code": "Department Code", "at_department": "Department", "at_description": "Description", "btn_add": "Add", "btn_update": "Edit Department", "btn_delete": "Delete", "btn_clear": "Clear", "th_action": "Action", "th_department": "Department", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('8').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.department_code = true;
          this.getDepartment();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  departmentCategoryData: any = [];

  departmentData: any = [];
  getDepartment() {
    this.httpService.http_api_post('company/department/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.departmentData = value.data.department;
        this.departmentCategoryData = value.data.category;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  departmentParse: any;
  departmentSubmit() {

    this.departmentParse = this.copying(this.formDepartment.getRawValue());
    this.departmentParse.update_by = this.httpService.currentUser.employee_id;
    this.departmentParse.update_datetime = new Date();

    if (this.departmentParse.department_id == '') {
      this.departmentParse.create_by = this.httpService.currentUser.employee_id;
      this.departmentParse.create_datetime = new Date();

      this.httpService.http_api_post('company/department', this.departmentParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formDepartment.patchValue({
              ...this.copying(this.departmentParse),
              department_id: value.data.department_id,
              department_code: value.data.department_code
            })
            this.getDepartment();
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

    this.httpService.http_api_put('company/department', this.departmentParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formDepartment.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formDepartment.patchValue({ ...this.copying(this.departmentParse) });
          }
          this.getDepartment();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  departmentDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formDepartment.patchValue({ is_active: 0 });
      this.departmentSubmit();
    }
  }

  clearAll() {
    this.formDepartment.reset(this._formDepartment);
  }

  editDepartment(item) {
    this.formDepartment.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getDepartment();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
