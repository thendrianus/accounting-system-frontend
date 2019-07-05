import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'pos_stand',
  styleUrls: ['./pos_stand.scss'],
  templateUrl: './pos_stand.html',
})
export class Pos_stand {

  _formPos_stand = { pos_stand_id: '', pos_stand: '', branch_id: '', positions: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  formPos_stand;
  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formPos_stand = this.formBuilder.group({ //sssss
      pos_stand_code: '',
      pos_stand_id: [''],
      pos_stand: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      branch_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      positions: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formPos_stand');
    console.log(this.formPos_stand);
  }

  gen: any = { "app_component_id": 0, "_title": "POS Stand", "_code": "Code", "ph_code": "Code", "ph_pos_stand": "POS Stand", "ph_position": "Position", "ph_description": "Description", "at_code": "Code", "at_pos_stand": "POS Stand", "at_branch": "Branch", "at_position": "Position", "at_description": "Description", "btn_add": " Add", "btn_update": "Update", "btn_delete": "Delete", "btn_clear": "Clear All", "th_action": "Action", "th_pos_stand": "POS Stand", "th_company": "Company", "th_position": "Position", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('39').subscribe(
      value => {
        console.log(value)
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.pos_stand_id = true;
          this.getPos_stand();
          this.getCompany();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  pos_standCategoryData: any = [];

  pos_standData: any = [];
  getPos_stand() {
    this.httpService.http_api_post('transaction/pos_stand/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.pos_standData = value.data.pos_stand;
        this.pos_standCategoryData = value.data.category;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }


  branchData: any = [];
  getCompany() {
    this.httpService.http_api_post('apps/branch/s', {}).subscribe((value) => {

      if (value.success) {
        this.branchData = value.data.branch;
        if (this.branchData.length > 0) {
          this._formPos_stand.branch_id = this.branchData[0].branch_id;
          this.formPos_stand.patchValue({ branch_id: this.branchData[0].branch_id });
        }
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  pos_standParse: any;
  pos_standSubmit() {

    this.pos_standParse = this.copying(this.formPos_stand.getRawValue());
    this.pos_standParse.update_by = this.httpService.currentUser.employee_id;
    this.pos_standParse.update_datetime = new Date();

    // this.pos_standParse.branch_id = this.currentUser.branch_id;

    if (this.pos_standParse.pos_stand_id == '') {
      this.pos_standParse.create_by = this.httpService.currentUser.employee_id;
      this.pos_standParse.create_datetime = new Date();

      this.httpService.http_api_post('transaction/pos_stand', this.pos_standParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formPos_stand.patchValue({
              ...this.copying(this.pos_standParse),
              pos_stand_id: value.data.pos_stand_id
            })
            this.getPos_stand();
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

    this.httpService.http_api_put('transaction/pos_stand', this.pos_standParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPos_stand.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formPos_stand.patchValue(this.copying(this.pos_standParse));
          }
          this.getPos_stand();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  pos_standDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPos_stand.patchValue({ is_active: 0 });
      this.pos_standSubmit();
    }
  }

  clearAll() {
    this.formPos_stand.reset(this._formPos_stand)
  }

  editPos_stand(item) {
    this.formPos_stand.patchValue(this.copying(item));
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getPos_stand();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
