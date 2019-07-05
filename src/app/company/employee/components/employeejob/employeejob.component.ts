import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'employeejob',
  styleUrls: ['./employeejob.scss'],
  templateUrl: './employeejob.html',
})
export class Employeejob {

  formEmployeejob;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };


  _formEmployeejob = { employee_job_id: '', name: '', description: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formEmployeejob = this.formBuilder.group({ //sssss
      employee_job_id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
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
    console.log('this.formEmployeejob');
    console.log(this.formEmployeejob);
  }

  gen: any = { "app_component_id": 0, "__title": "Employeejob", "ph_ph_employeejob_id": "Employeejob", "ph_ph_name": "Name", "ph_ph_description": "Persentage", "at_at_employeejob_id": "Employeejob", "at_at_name": "Name", "at_at_description": "Persentage", "btn_btn_add": "Add", "btn_btn_edit": "Update", "btn_btn_delete": "Cancel", "btn_btn_clear": "Clear All", "th_th_action": "Action", "th_th_name": "Name", "th_th_description": "Persentage", "th_th_account": "Account", "th_td_edit": "Edit" };

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
    this.httpService.getTranslate('60').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getAccountData();
          this.getEmployeejob();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  employeejobData: any = [];
  getEmployeejob() {
    this.httpService.http_api_post('apps/employeejob/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.employeejobData = value.data.employeejob;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  employeejobParse: any;
  employeejobSubmit() {

    this.employeejobParse = this.copying(this.formEmployeejob.getRawValue());
    this.employeejobParse.update_by = this.httpService.currentUser.employee_id;
    this.employeejobParse.update_datetime = new Date();

    if (this.employeejobParse.employee_job_id == '') {
      this.employeejobParse.create_by = this.httpService.currentUser.employee_id;
      this.employeejobParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/employeejob', this.employeejobParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formEmployeejob.patchValue({
              ...this.copying(this.employeejobParse),
              employee_job_id: value.data.employee_job_id
            })

            this.getEmployeejob();
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

    this.httpService.http_api_put('apps/employeejob', this.employeejobParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formEmployeejob.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formEmployeejob.patchValue({ ...this.copying(this.employeejobParse) });
          }
          this.getEmployeejob();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  employeejobDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formEmployeejob.patchValue({ is_active: 0 });
      this.employeejobSubmit();
    }
  }

  clearAll() {
    this.formEmployeejob.reset(this._formEmployeejob);
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

  editEmployeejob(item) {
    this.formEmployeejob.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getEmployeejob();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
