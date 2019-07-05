import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'uom',
  styleUrls: ['./uom.scss'],
  templateUrl: './uom.html',
})
export class Uom {

  formUom;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formUom = { uom_id: '', uom: '', uom_symbol: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formUom = this.formBuilder.group({ //sssss
      uom_id: '',
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom_symbol: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
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
    console.log('this.formUom');
    console.log(this.formUom);
  }


  gen: any = { "app_component_id": 0, "_title": "UOM", "ph_uom_id": "UOM Code", "ph_uom": "UOM", "ph_uom_symbol": "UOM Symbol", "ph_description": "Description", "at_uom_id": "UOM Code", "at_uom": "UOM", "at_uom_symbol": "UOM Symbol", "at_description": "Description", "btn_add": "Add", "btn_edit": "Update", "btn_delete": "Cancel", "btn_clear": "Clear All", "th_action": "Action", "th_uom": "UOM", "th_uom_symbol": "Symbol", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('13').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getUom();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  uomData: any = [];
  getUom() {
    this.httpService.http_api_post('apps/uom/select', { is_use: '0' }).subscribe((value) => {

      if (value.success) {
        this.uomData = value.data.uom;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  uomParse: any;
  uomSubmit() {

    this.uomParse = this.copying(this.formUom.getRawValue());
    this.uomParse.update_by = this.httpService.currentUser.employee_id;
    this.uomParse.update_datetime = new Date();

    if (this.uomParse.uom_id == '') {
      this.uomParse.create_by = this.httpService.currentUser.employee_id;
      this.uomParse.create_datetime = new Date();

      this.httpService.http_api_post('apps/uom', this.uomParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formUom.patchValue({
              ...this.copying(this.uomParse),
              uom_id: value.data.uom_id
            })
            this.getUom();
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

    this.httpService.http_api_put('apps/uom', this.uomParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formUom.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formUom.patchValue({ ...this.copying(this.uomParse) });
          }
          this.getUom();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  uomDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formUom.patchValue({ is_active: 0 });
      this.uomSubmit();
    }
  }

  clearAll() {
    this.formUom.reset(this._formUom);
  }

  editUom(item) {
    this.formUom.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getUom();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
