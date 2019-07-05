import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'businesspartner_group',
  styleUrls: ['./businesspartner_group.scss'],
  templateUrl: './businesspartner_group.html',
})
export class Businesspartner_group {

  formBusinesspartnergroup;

  _formBusinesspartnergroup = { businesspartner_group_id: '', businesspartner_group: '', description: '', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formBusinesspartnergroup = this.formBuilder.group({ //sssss
      businesspartner_group_id: '',
      businesspartner_group: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
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
    console.log('this.formBusinesspartnergroup');
    console.log(this.formBusinesspartnergroup);
  }

  gen: any = { "app_component_id": 0, "_title": "Businesspartner_group", "ph_businesspartner_group_id": "Businesspartner_group", "ph_businesspartner_group": "Businesspartner_group", "ph_description": "Persentage", "at_businesspartner_group_id": "Businesspartner_group", "at_businesspartner_group": "Businesspartner_group", "at_description": "Persentage", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Cancel", "btn_clear": "Clear All", "th_action": "Action", "th_businesspartner_group": "Businesspartner_group", "th_description": "Persentage", "td_edit": "Edit" };

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
    this.httpService.getTranslate('61').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getBusinesspartner_group();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  businesspartner_groupData: any = [];
  getBusinesspartner_group() {
    this.httpService.http_api_post('apps/businesspartnergroup/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.businesspartner_groupData = value.data.businesspartnergroup;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  businesspartner_groupParse: any;
  businesspartner_groupSubmit() {

    this.businesspartner_groupParse = this.copying(this.formBusinesspartnergroup.getRawValue());
    this.businesspartner_groupParse.update_by = this.httpService.currentUser.employee_id;
    this.businesspartner_groupParse.update_datetime = new Date();

    if (this.businesspartner_groupParse.businesspartner_group_id == '') {
      this.businesspartner_groupParse.create_by = this.httpService.currentUser.employee_id;
      this.businesspartner_groupParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/businesspartnergroup', this.businesspartner_groupParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formBusinesspartnergroup.patchValue({
              ...this.copying(this.businesspartner_groupParse),
              businesspartner_group_id: value.data.businesspartner_group_id
            });
            this.getBusinesspartner_group();
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

    this.httpService.http_api_put('apps/businesspartnergroup', this.businesspartner_groupParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formBusinesspartnergroup.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formBusinesspartnergroup.patchValue({
              ...this.copying(this.businesspartner_groupParse)
            })
          }
          this.getBusinesspartner_group();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  businesspartner_groupDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formBusinesspartnergroup.patchValue({
        is_active: 0
      })
      this.businesspartner_groupSubmit();
    }
  }

  clearAll() {
    this.formBusinesspartnergroup.reset(this._formBusinesspartnergroup);
  }

  editBusinesspartner_group(item) {
    this.formBusinesspartnergroup.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getBusinesspartner_group();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
