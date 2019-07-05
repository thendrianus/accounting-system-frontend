import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'branch',
  styleUrls: ['./branch.scss'],
  templateUrl: './branch.html',
})
export class Branch {

  formBranch;

  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formBranch = { branch_id: '', branch_code: '', branch: '', headquater: 0, description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formBranch = this.formBuilder.group({ //sssss
      branch_id: '',
      branch_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      headquater: 0,
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
    console.log('this.formBranch');
    console.log(this.formBranch);
  }

  gen: any = { "app_component_id": 0, "_title": "Branch", "ph_code": "Branch Code", "ph_branch": "Branch", "ph_description": "Description", "at_code": "Branch Code", "at_branch": "Branch", "at_description": "Description", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Cancel", "btn_clear": "Clear", "th_action": "Action", "th_branch": "Branch", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('5').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.branch_code = true;
          this.getBranch();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  branchCategoryData: any = [];

  branchData: any = [];
  getBranch() {
    this.httpService.http_api_post('apps/branch/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.branchData = value.data.branch;
        this.branchCategoryData = value.data.category;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  branchParse: any;
  branchSubmit() {

    this.branchParse = this.copying(this.formBranch.getRawValue());
    this.branchParse.update_by = this.httpService.currentUser.employee_id;
    this.branchParse.update_datetime = new Date();

    if (this.branchParse.branch_id == '') {
      this.branchParse.create_by = this.httpService.currentUser.employee_id;
      this.branchParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/branch', this.branchParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formBranch.patchValue({
              ...this.copying(this.branchParse),
              branch_id: value.data.branch_id,
              branch_code: value.data.branch_code,
            })
            this.getBranch();
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

    this.httpService.http_api_put('apps/branch', this.branchParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formBranch.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formBranch.patchValue({ ...this.copying(this.branchParse) });
          }
          this.getBranch();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  branchDelete() {
    if (this.formBranch.value.headquater == 0) {
      if (confirm("Are you sure to delete this data?")) {
        this.formBranch.patchValue({ is_active: 0 });
        this.branchSubmit();
      }
    } else {
      this.notif.error = { title: 'Error', content: 'this is headquater', setting: this.httpService.error, change: Math.random().toString() };
    }
  }

  clearAll() {
    this.formBranch.reset(this._formBranch);
  }

  editBranch(item) {
    this.formBranch.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getBranch();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
