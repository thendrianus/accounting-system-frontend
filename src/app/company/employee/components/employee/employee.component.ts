import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
// import { UploaderOptions } from 'ngx-uploader';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'employee',
  styleUrls: ['./employee.scss'],
  templateUrl: './employee.html',
})
export class Employee {

  @ViewChild('childModal') public childModal: ModalDirective;

  currentUser: any = { employee_job_id: 0 };

  openModal: any = 0;

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date(), jsdate: new Date() };

  formEmployee;
  public employeeParse: any = {};

  public config = {
    uiColor: '#F0F3F4',
    height: '600',
    allowedContent: true,
  };

  public defaultPicture = 'assets/img/no-photo.png';

  // public uploaderOptions: UploaderOptions = {
  //   url: this.httpService.baseUrl + 'file',
  //   filterExtensions: true,
  //   allowedExtensions: ['jpg', 'png'],
  //   maxSize: 2097152,
  // };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formEmployee = { employee_id: '', employee_code: '', employee_category_id: '1', title: 'Mr', firstname: '', lastname: '', address: '', phone_number: '', birth_place: '', birth_date: moment().format("YYYY-MM-DD"), times: '', picture: '', email: '-', employee_status_id: '1', employee_job_id: '1', description: '-', is_use: 1, is_active: 1, create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), label: '', is_sales: 0, is_purchasesman: 0, is_debt_collector: 0, sales_desc: '-', purchasesman_desc: '-', debt_collector_desc: '-' }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formEmployee = this.formBuilder.group({ //sssss
      employee_id: '',
      employee_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      employee_category_id: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      title: ['Mr', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      phone_number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      birth_place: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      birth_date: moment().format("YYYY-MM-DD"),
      picture: ['', [Validators.minLength(0), Validators.maxLength(50)]],
      email: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      employee_status_id: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      employee_job_id: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      is_use: 1,
      is_active: 1,
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      label: '',
      is_sales: [0, [Validators.minLength(0), Validators.maxLength(1)]],
      is_purchasesman: [0, [Validators.minLength(0), Validators.maxLength(1)]],
      is_debt_collector: [0, [Validators.minLength(0), Validators.maxLength(1)]],
      sales_desc: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      purchasesman_desc: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      debt_collector_desc: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      times: [''],
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formEmployee');
    console.log(this.formEmployee);
  }

  // test(){
  //   this.openModal = Math.random().toString();
  // }

  gen: any = { "app_component_id": 0, "_title": "Karyawan", "_code": "Kode Karyawan", "_titleModal1": "Pencarian Karyawan", "_delete_warning": "Apakah anda yakin inging menghapus ", "ph_employee_code": "Kode Karyawan", "ph_firstname": "Nama Depan", "ph_lastname": "Judul", "ph_address": "Nama Belakang", "ph_phone_number": "No Handphone", "ph_birth_place": "Tempat Lahir", "ph_email": "Email", "ph_description": "Deskripsi", "at_employee_code": "Kode Karyawan", "at_category": "Kategory", "at_title": "Judul", "at_firstname": "Nama Belakang", "at_lastname": "Nama Belakang", "at_address": "Alamat", "at_phone_number": "No Handphone", "at_birth_place": "Tempat Lahir", "at_birth_date": "Tanggal Lahir", "at_picture": "Gambar", "at_email": "Email", "at_job_name": "Nama Tugas", "at_status": "Status", "at_description": "Deskripsi", "btn_add": "Tambahkan", "btn_edit": "Rubah", "btn_delete": "Hapus", "btn_clear": "Kosongkan", "btn_search": "Pencarian", "btn_closeModal1": "Tutup", "tn_email": "Email", "tn_birthdate": "Tanggal Lahir", "tn_employee_code": "Kode Karyawan", "tn_name": "Nama", "tn_phone_number": "No Handphone", "tn_job_name": "Jabatan", "tn_is_use": "Aktif", "td_select": "Pilih" };

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
    this.httpService.getTranslate('22').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.getJob();
          this.checkEmployeeCode();
        } else {
          this.httpService.goToDashboard();
        }

      }
    )
  }

  employeejob: any = [];

  getJob() {
    this.httpService.http_api_post('apps/employeejob/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.employeejob = value.data.employeejob;
          if (this.employeejob.length > 0) {
            this.formEmployee.patchValue({ employee_job_id: this.employeejob[0].employee_job_id });
          }
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };

        });
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  formSubmit() {

    this.employeeParse = this.copying(this.formEmployee.getRawValue());
    this.employeeParse.create_by = this.httpService.currentUser.employee_id;
    this.employeeParse.update_by = this.httpService.currentUser.employee_id;
    this.employeeParse.update_datetime = new Date();
    this.employeeParse.create_datetime = new Date();

    if (this.employeeParse.employee_id == '') {
      this.employeeParse.birth_dateParse = this.employeeParse.birth_date.toString();
      this.httpService.http_api_post('hrd/employee', this.employeeParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setemployee(this.employeeParse);
            this.formEmployee.patchValue({
              employee_id: value.data.lastId,
              employee_code: value.data.employee_code
            })
            this.checkEmployeeCode();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updateEmployee();
    }
  }

  updateEmployee() {

    this.employeeParse = this.copying(this.formEmployee.getRawValue());
    this.employeeParse.update_by = this.httpService.currentUser.employee_id;
    this.employeeParse.birth_dateParse = this.employeeParse.birth_date.toString();
    this.employeeParse.update_datetime = new Date();

    this.httpService.http_api_put('hrd/employee', this.employeeParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formEmployee.value.is_active == 0) {
            this.clearAll();
          } else {
            this.setemployee(this.employeeParse);
            this.checkEmployeeCode();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  deleteEmployee() {

    if (confirm(this.gen._delete_warning + this.formEmployee.value.label)) {
      this.formEmployee.patchValue({ is_active: 0 });
      this.updateEmployee();
    }

  }

  clearAll() {
    this.setemployee(false);
    this.checkEmployeeCode();
  }

  setemployee(data) {
    if (data) {
      data.birth_date = moment(data.birth_date).format("YYYY-MM-DD")
      this.formEmployee.patchValue({ ...this.copying(data) });
    } else {
      this.formEmployee.reset(this._formEmployee)
    }
  }

  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      this.formEmployee.patchValue({ picture: JSON.parse(data.response)[0].filename });
    }

  }

  modalShow() {
    this.ModalHeader = 'List Employee';
    this.ModalGetEmployee();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.setemployee(this.ModalSelectedEmployee);
    this.checkEmployeeCode();
  }

  public ModalEmployee: any = [];
  public ModalHeader: string;
  public ModalSelectedEmployee: any = [];

  gens = { td_refresh: 'Refresh' }
  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        add: true,
        edit: false,
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.td_select}`,
        confirmDelete: true,
      },
      add: {
        addButtonContent: `${this.gens.td_refresh}`,
        confirmSave: true,
      },
      columns: this.httpService.generateng2columns({
        employee_code: {
          title: this.gen.tn_employee_code,
          type: 'string',
          width: '10%',
          show: this.gen.ts_employee_code
        },
        label: {
          title: this.gen.tn_name,
          type: 'string',
          width: '20%',
          show: this.gen.ts_name
        },
        job_name: {
          title: this.gen.tn_job_name,
          type: 'string',
          show: this.gen.ts_job_name
        },
        phone_number: {
          title: this.gen.tn_phone_number,
          type: 'string',
          show: this.gen.ts_phone_number
        },
        email: {
          title: this.gen.tn_email,
          type: 'string',
          show: this.gen.ts_email
        },
        birth_date_label: {
          title: this.gen.tn_birthdate,
          type: 'string',
          show: this.gen.ts_birthdate
        },
        is_use_label: {
          title: this.gen.tn_is_use,
          type: 'string',
          width: '20px',
          show: this.gen.ts_is_use
        }
      }),
      pager: {
        perPage: 75
      }
    }
  }

  source: LocalDataSource = new LocalDataSource();

  ModalGetEmployee() {
    this.ModalEmployee = JSON.parse("[]");
    this.httpService.http_api_post('hrd/employee/select', { is_use: '0' }).subscribe((value) => {
      if (value.success) {
        this.ModalEmployee = value.data.employee;
        this.source.load(this.ModalEmployee);
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  refresh_search() {
    this.ModalGetEmployee();
  }

  ModalSelectEmployee(item) {
    if (item.data.picture == '') {
      item.data.oldpicture = 'assets/img/no-photo.png';
    } else {
      item.data.oldpicture = this.httpService.baseAssetsDisc + 'employee/' + item.data.picture;
    }

    this.ModalSelectedEmployee = item.data;

    this.modalOut();
    this.modalHide();
  }

  checkEmployeeCode() {

    if (this.formEmployee.value.employee_code != '') {
      this.disableInput.employee_code = true;
    } else {
      this.disableInput.employee_code = false;
    }

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

}
