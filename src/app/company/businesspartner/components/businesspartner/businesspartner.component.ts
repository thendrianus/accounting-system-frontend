import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'businesspartner',
  styleUrls: ['./businesspartner.scss'],
  templateUrl: './businesspartner.html',
})
export class Businesspartner {

  @ViewChild('childModal') public childModal: ModalDirective;

  public businesspartners: any = [];

  formBusinesspartner;
  businesspartnerParse;

  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formBusinesspartner = { businesspartner_id: '', businesspartner_code: '', name: '', businesspartner_category_id: '1', description: '-', businesspartner_group_id: '', salesman_employee_id: '', collector_employee_id: '', discount_date: 0, due_date: 0, early_discount: 0, late_charge: 0, update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formBusinesspartner = this.formBuilder.group({ //sssss
      businesspartner_id: '',
      businesspartner_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      businesspartner_category_id: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      businesspartner_group_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      salesman_employee_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      collector_employee_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      discount_date: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      due_date: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      early_discount: [0, [Validators.minLength(0), Validators.maxLength(20)]],
      late_charge: [0, [Validators.minLength(0), Validators.maxLength(20)]],
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
    console.log('this.formBusinesspartner');
    console.log(this.formBusinesspartner);
  }

  gen: any = { "app_component_id": 0, "_title": "Mitra Bisnis", "_M1": "Daftar / Pencarian  Mitra Bisnis", "_M1close": "Tutup", "_address": "Alamat", "_contact": "Kontak", "ph_code": "Kode Partner", "ph_name": "Name", "ph_description": "Descripsi", "at_code": "No/Kode", "at_name": "Name", "at_category": "Kategori", "at_description": "Descripsi", "at_salesman": "Yang Menjual", "at_deptcollector": "Penagih Hutang", "at_group": "Grup", "btn_add": "Tambahkan", "btn_edit": "Rubah", "btn_delete": "Hapus", "btn_clear": "Kosongkan Form", "btn_search": "Pencarian", "ts_name": "1", "ts_code": "1", "ts_collector": "0", "ts_group": "1", "ts_category": "1", "ts_salesman": "0", "ts_description": "1", "tn_name": "Nama", "tn_code": "Kode", "tn_group": "Group", "tn_category": "Kategori", "tn_salesman": "Salesman", "tn_collector": "Kolektor", "tn_description": "Deskripsi" };

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
    this.httpService.getTranslate('4').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.businesspartner_code = true;
          this.getBusinessPartnerGroup();
          this.getEmployee('debtcollector');
          this.getEmployee('salesman');
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  formSubmit() {

    this.businesspartnerParse = this.copying(this.formBusinesspartner.getRawValue());
    this.businesspartnerParse.create_by = this.httpService.currentUser.employee_id;
    this.businesspartnerParse.update_by = this.httpService.currentUser.employee_id;
    this.businesspartnerParse.update_datetime = new Date();
    this.businesspartnerParse.create_datetime = new Date();

    if (this.businesspartnerParse.businesspartner_id == '') {
      this.httpService.http_api_post('company/businesspartner', this.businesspartnerParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formBusinesspartner.patchValue({
              ...this.copying(this.businesspartnerParse),
              businesspartner_id: value.data.lastId,
              businesspartner_code: value.data.businesspartner_code
            })
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateBusinesspartner();
    }

  }

  updateBusinesspartner() {

    this.businesspartnerParse = this.copying(this.formBusinesspartner.getRawValue());
    this.businesspartnerParse.update_by = this.httpService.currentUser.employee_id;
    this.businesspartnerParse.update_datetime = new Date();

    this.httpService.http_api_put('company/businesspartner', this.businesspartnerParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formBusinesspartner.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formBusinesspartner.patchValue({ ...this.copying(this.businesspartnerParse) });
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  deleteBusinesspartner() {
    if (confirm("Are you sure to delete this data?")) {
      this.formBusinesspartner.patchValue({ is_active: 0 });
      this.formSubmit();
    }
  }

  clearAll() {
    this.formBusinesspartner.reset(this._formBusinesspartner);
  }

  modalShow() {
    this.ModalHeader = 'List Businesspartner';
    this.ModalGetBusinesspartner();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.formBusinesspartner.patchValue({ ...this.ModalSelectedBusinesspartner });
  }

  public ModalBusinesspartner: any = [];
  public ModalHeader: string;
  public ModalSelectedBusinesspartner: any = {};

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
        deleteButtonContent: `Select`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        name: {
          title: this.gen.tn_name,
          type: 'string',
          show: this.gen.ts_name
        },
        businesspartner_code: {
          title: this.gen.tn_code,
          type: 'string',
          show: this.gen.ts_code
        },
        businesspartner_group: {
          title: this.gen.tn_group,
          type: 'string',
          show: this.gen.ts_group
        },
        businesspartner_category: {
          title: this.gen.tn_category,
          type: 'string',
          show: this.gen.ts_category
        },
        salesman_employee: {
          title: this.gen.tn_salesman,
          type: 'string',
          show: this.gen.ts_salesman
        },
        collector_employee: {
          title: this.gen.tn_collector,
          type: 'string',
          show: this.gen.ts_collector
        },
        description: {
          title: this.gen.tn_description,
          type: 'string',
          show: this.gen.ts_description
        }
      }),
      pager: {
        perPage: 75
      }
    }
  }
  source: LocalDataSource = new LocalDataSource();

  ModalGetBusinesspartner() {
    this.ModalBusinesspartner = JSON.parse("[]");
    this.httpService.http_api_post('company/businesspartner/select', { is_use: '0' }).subscribe((value) => {
      if (value.success) {

        this.ModalBusinesspartner = value.data.businesspartner;
        this.source.load(this.ModalBusinesspartner);

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalSelectBusinesspartner(item) {
    if (item.data.picture == '') {
      item.data.oldpicture = 'assets/img/no-photo.png';
    } else {
      item.data.oldpicture = this.httpService.baseAssetsDisc + 'businesspartner/' + item.data.picture;
    }

    this.ModalSelectedBusinesspartner = item.data;
    this.modalOut();
    this.modalHide();
  }

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
  businesspartnergroup;
  getBusinessPartnerGroup() {
    this.httpService.http_api_post('apps/businesspartnergroup/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.businesspartnergroup = value.data.businesspartnergroup;
          if (this.businesspartnergroup.length > 0) {
            this.formBusinesspartner.patchValue({ businesspartner_group_id: this.businesspartnergroup[0].businesspartner_group_id });
            this._formBusinesspartner.businesspartner_group_id = this.businesspartnergroup[0].businesspartner_group_id;
          }
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  employeeJobCollector: any = [];
  employeeJobSalesman: any = [];
  getEmployee(action) {
    this.httpService.http_api_put('hrd/employee/select', { action: action })
      .subscribe((value) => {
        if (value.success) {
          if (action == "salesman") {
            this.employeeJobSalesman = value.data.employee;
            if (this.employeeJobSalesman.length > 0) {
              this.formBusinesspartner.patchValue({ salesman_employee_id: this.employeeJobSalesman[0].employee_id });
              this._formBusinesspartner.salesman_employee_id = this.employeeJobSalesman[0].employee_id;
            }
          } else if (action == "debtcollector") {
            this.employeeJobCollector = value.data.employee;
            if (this.employeeJobCollector.length > 0) {
              this.formBusinesspartner.patchValue({ collector_employee_id: this.employeeJobCollector[0].employee_id });
              this._formBusinesspartner.collector_employee_id = this.employeeJobCollector[0].employee_id;
            }
          }
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

}
