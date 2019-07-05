import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { HttpService } from '../../../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'address',
  styleUrls: ['./address.scss'],
  templateUrl: './address.html'
})
export class Address {

  @ViewChild('childModal') public childModal: ModalDirective;

  @Output() setAddress: EventEmitter<string> = new EventEmitter<string>();
  @Input() businesspartnerOrder;

  currentUser: any = { employee_job_id: 0 };

  ngOnChanges(changes: any) {

    if (changes.businesspartnerOrder.currentValue != '') {
      this.getBusinesspartneraddress();
    } else {
      this.address = JSON.parse("[]");
    }

  }

  address: any = [];

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormAddress = { businesspartner_address_code: '', businesspartner_address_id: '', businesspartner_id: '', businesspartner_category: '1', name: '', address: '-', description: '-', city: '-', telp1: '0', telp2: '0', telp3: '0', fax: '0', poscode: '0', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.ModalFormAddress = this.formBuilder.group({ //sssss
      businesspartner_address_code: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      businesspartner_address_id: '',
      businesspartner_id: '',
      businesspartner_category: ['1', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      address: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      city: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      telp1: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      telp2: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      telp3: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      fax: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      poscode: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      is_active: 1
    });

  }

  printConsoleForm() {
    console.log('this.ModalFormAddress');
    console.log(this.ModalFormAddress);
  }

  gen: any = { "app_component_id": 0, "_M1": "Tambah / Rubah Alamat", "_close": "Tutup", "ph_name": "Nama", "ph_address": "Alamat", "ph_telp1": "Telp 1", "ph_telp2": "Telp 2", "ph_telp3": "Telp 3", "ph_city": "Kota", "ph_fax": "Fax", "ph_Poscode": "Kode Pos", "ph_description": "Deskripsi", "at_name": "Nama", "at_address": "Alamat", "at_telp1": "Telp 1", "at_telp2": "Telp 2", "at_telp3": "Telp 3", "at_city": "Kota", "at_fax": "Fax", "at_Poscode": "Kode Pos", "at_description": "Deskripsi", "btn_newbtn": "Tambah Alamat Baru", "btn_add": "Tambahkan", "btn_edit": "Rubah", "btn_delete": "Hapus", "th_action": "Aksi", "th_no": "No", "th_name": "Nama", "th_address": "Alamat", "td_edit": "Rubah" };

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
    this.httpService.getTranslate('63').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  getBusinesspartneraddress() {
    this.httpService.http_api_post('company/businesspartner/addresslist', { businesspartner_id: this.businesspartnerOrder })
      .subscribe((value) => {

        if (value.success) {
          this.address = value.data.address;
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  modalShow(item) {

    this.ModalHeader = 'List Address';

    if (item == '') {
      this.ModalFormAddress.reset({
        ...this._ModalFormAddress,
        businesspartner_id: this.businesspartnerOrder
      });
      this.ModalHeader = this.gen._M1;
    } else {
      this.ModalFormAddress.patchValue({ ...item });
      this.ModalHeader = this.gen._M12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.getBusinesspartneraddress();
    this.modalHide();
  }

  public ModalHeader: string;

  ModalFormAddress;
  ModalAddressParse;

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  ModalFormSubmit() {

    this.ModalAddressParse = this.copying(this.ModalFormAddress.getRawValue());
    this.ModalAddressParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalAddressParse.update_datetime = new Date();

    if (this.ModalAddressParse.businesspartner_address_id == '') {
      this.ModalAddressParse.create_by = this.httpService.currentUser.employee_id;
      this.ModalAddressParse.create_datetime = new Date();
      this.httpService.http_api_post('company/businesspartner/address', this.ModalAddressParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.ModalFormAddress.patchValue({
              ...this.copying(this.ModalAddressParse),
              businesspartner_address_id: value.data.lastId,
              businesspartner_address_code: value.data.businesspartner_address_code
            })
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
          this.modalOut();
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.ModalUpdateAddress();
    }
  }

  ModalUpdateAddress() {

    this.httpService.http_api_put('company/businesspartner/address', this.ModalAddressParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.ModalFormAddress.value.is_active == 0) {
            this.modalHide();
          } else {
            this.ModalFormAddress.patchValue({ ...this.copying(this.ModalAddressParse) });
          }
          this.modalOut();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  deleteAddress() {

    if (confirm("Are you sure to delete this data?")) {
      this.ModalFormAddress.patchValue({ is_active: 0 });
      this.ModalFormSubmit();
    }

  }

}
