import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'ts-componentgen',
  styleUrls: ['./component_gen.scss'],
  templateUrl: './component_gen.html'
})
export class Component_gen {

  @ViewChild('childModal') public childModal: ModalDirective;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormAtt = { app_component_attribute_id: '', ts_value: '', ts_value1: '', app_component_id: "1", app_attribute_category_id: '1', ts_label: 0, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.ModalFormAtt = this.formBuilder.group({ //sssss
      app_component_attribute_id: '',
      ts_value: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      ts_value1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      app_component_id: "1",
      app_attribute_category_id: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      ts_label: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(35)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

  }

  refreshComponent() {
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  generate(id, lang) {

    this.httpService.http_api_put('apps/componentgenerate', { app_component_id: id, language: lang })
      .subscribe(
        value => {
          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
        },
        error => {
          console.log(error);
        }
      );

  }
  AttData = [];
  getAttData() {

    this.httpService.http_api_get('apps/componentgenerate/component_gen/')
      .subscribe(
        value => {
          if (value.success) {
            this.AttData = value.data.att;
          }
        },
        error => {
          console.log(error);
        }
      );

  }

  getGenerateGen() {
    this._ModalFormAtt.app_component_id = this.ModalFormAtt.value.app_component_id
    this.httpService.http_api_post('apps/componentgenerate', { app_component_id: this.ModalFormAtt.value.app_component_id, })
      .subscribe(
        value => {

          if (value.success) {
            this.source.load(value.data.att);
          }
        },
        error => {
          console.log(error);
        }
      );

  }


  printConsoleForm() {
    console.log('this.ModalFormAtt');
    console.log(this.ModalFormAtt);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Beginning Att", "_titleModal1": "Modal Title", "ph_ts_label": "Ts Tabel", "ph_ts_value": "ts_value", "ph_ts_value1": "ts_value1", "at_dateModal1": "Date", "at_categoryModal1": "Category", "at_ts_labelModal1": "Ts Tabel", "at_ts_valueModal1": "ts_value", "at_ts_value1Modal1": "ts_value1", "btn_clear_data": "Clear Data", "btn_closeModal1": "Close", "btn_addModal1": "Add", "btn_editModal1": "Edit", "btn_deleteModal1": "Delete", "th_date": "Date", "th_category_name": "Category Name", "th_ts_label": "Ts Tabel", "th_ts_value": "ts_value", "th_ts_value1": "ts_value1", "td_detail": "Detail", "td_edit": "Edit", "td_add": "Add" };

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
    this.httpService.getTranslate('62').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id") || this.httpService.currentUser.employee_id == '1') {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getGenerateGen();
          this.getAttData();
          this.settings = Object.assign({}, this.mySettings());
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        delete: false
      },
      mode: 'external',
      edit: {
        editButtonContent: `${this.gen.td_edit}`,
        confirmSave: true,
      },
      add: {
        addButtonContent: `${this.gen.td_add}`,
      },
      columns: this.httpService.generateng2columns({
        app_attribute_category_id: {
          title: this.gen.th_category_name,
          type: 'html',
          editable: false,
          editor: {
            type: 'list',
            config: {
              list: [
                { value: '1', title: 'Title (_)' },
                { value: '2', title: 'Placeholder (ph_)' },
                { value: '3', title: 'Attribute (at_)' },
                { value: '4', title: 'Button (btn_)' },
                { value: '5', title: 'Table Header(th_)' },
                { value: '6', title: 'Table Detail' },
                { value: '7', title: 'Ng2 Table Show' },
                { value: '8', title: 'Ng2 Table Name' }
              ]
            }
          },
          show: 1
        },
        ts_label: {
          title: this.gen.th_ts_label,
          type: 'string',
          editable: false,
          show: 1
        },
        ts_value: {
          title: this.gen.th_ts_value,
          type: 'number',
          show: 1
        },
        ts_value1: {
          title: this.gen.th_ts_value1,
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

  modalShow(item) {

    this.ModalHeader = 'Att Detail';
    console.log(8898989)
    if (!item.data) {

      this.ModalFormAtt.reset(this._ModalFormAtt);

    } else {
      this.ModalFormAtt.patchValue(item.data);
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.modalHide();
  }

  public ModalHeader: string;

  ModalFormAtt;
  ModalAttParse;

  ModalFormSubmit() {
    console.log(this.ModalFormAtt.value.app_component_id)
    this.ModalAttParse = this.copying(this.ModalFormAtt.getRawValue());
    this.ModalAttParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalAttParse.update_datetime = new Date();

    if (this.ModalAttParse.app_component_attribute_id == '') {
      this.ModalAttParse.create_by = this.httpService.currentUser.employee_id;
      this.ModalAttParse.create_datetime = new Date();
      this.httpService.http_api_post('apps/componentgenerate/component_gen', this.ModalAttParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this._ModalFormAtt.app_component_id = this.ModalAttParse.app_component_id
            // this.ModalAtt.app_component_attribute_id = value.data.lastId;
            this.ModalFormAtt.patchValue({ app_component_attribute_id: '' });
            // this.modalOut();
            this.getGenerateGen();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.ModalUpdateAtt();
    }

  }

  ModalUpdateAtt() {

    this.httpService.http_api_put('apps/componentgenerate/component_gen', this.ModalAttParse)
      .subscribe((value) => {
        if (value.success) {
          if (this.ModalFormAtt.value.is_active == 0) {
            this.modalHide();
          } else {
            this.ModalFormAtt.patchValue({ app_component_attribute_id: '' });
          }
          this.modalOut();
          this.getGenerateGen();
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  ModalDeleteAtt() {

    if (confirm("Are you sure to delete this?")) {
      this.ModalFormAtt.patchValue({ is_active: 0 });
      this.ModalFormSubmit();
    }

  }

}
