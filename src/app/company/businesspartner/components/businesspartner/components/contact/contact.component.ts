import { Component, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { HttpService } from '../../../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'contact',
  styleUrls: ['./contact.scss'],
  templateUrl: './contact.html'
})
export class Contact {

  @ViewChild('childModal') public childModal: ModalDirective;
  @Output() setContact: EventEmitter<string> = new EventEmitter<string>();
  @Input() businesspartnerOrder = '';

  currentUser: any = { employee_job_id: 0 };

  ngOnChanges(changes: any) {

    if (changes.businesspartnerOrder.currentValue != '') {
      this.getBusinesspartnercontact();
    } else {
      this.contact = JSON.parse("[]");
    }

  }

  contact: any = [];
  selectedContact: string = '';

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormContact = { businesspartner_contact_id: '', businesspartner_id: '', businesspartner_contact_code: '', name: '', positions: '-', address: '-', telp1: '0', telp2: '0', email: '-', city: '-', poscode: '-', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.ModalFormContact = this.formBuilder.group({ //sssss
      businesspartner_contact_id: '',
      businesspartner_id: '',
      businesspartner_contact_code: ['', [Validators.minLength(1), Validators.maxLength(50)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      positions: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      address: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      telp1: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      telp2: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      email: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      city: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      poscode: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      is_active: 1
    });

  }

  printConsoleForm() {
    console.log('this.ModalFormContact');
    console.log(this.ModalFormContact);
  }


  gen: any = { "app_component_id": 0, "_M1": "Tambah / Rubah Kontak", "_closeM1": "Close", "ph_Name": "Nama", "ph_Position": "Posisi", "ph_Address": "Alamat", "ph_Telp1": "Telp 1", "ph_Email": "Email", "ph_Poscode": "Kode Pos", "ph_description": "Deskripsi", "ph_Telp2": "Telp 2", "at_Name": "nama", "at_Position": "Posisi", "at_Address": "Alamat", "at_Telp1": "Telp 1", "at_Email": "Email", "at_Poscode": "Kode Pos", "at_description": "Deskripsi", "at_Telp2": "Telp 2", "btn_newcontact": "Tambah Kontak Baru", "btn_Add": "Tambahkan", "btn_Edit": "Rubah", "btn_Delete": "Hapus", "th_Action": "Aksi", "th_No": "No", "th_Name": "Nama", "th_address": "Alamat", "td_Edit": "Edit" };

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
    this.httpService.getTranslate('64').subscribe(
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

  getBusinesspartnercontact() {
    this.httpService.http_api_post('company/businesspartner/contactlist', { businesspartner_id: this.businesspartnerOrder })
      .subscribe((value) => {

        if (value.success) {
          this.contact = value.data.contact;
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  modalShow(item) {

    this.ModalHeader = 'List Contact';

    if (item == '') {
      this.ModalFormContact.reset({
        ...this._ModalFormContact,
        businesspartner_id: this.businesspartnerOrder
      });
      this.ModalHeader = this.gen._M1;
    } else {
      this.ModalFormContact.patchValue({ ...item });
      this.ModalHeader = this.gen._M12;
    }
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.getBusinesspartnercontact();
    this.modalHide();
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  public ModalHeader: string;

  @Output() out = new EventEmitter();
  ModalFormContact;
  ModalContactParse;

  ModalFormSubmit() {

    this.ModalContactParse = this.copying(this.ModalFormContact.getRawValue());

    this.ModalContactParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalContactParse.update_datetime = new Date();

    if (this.ModalContactParse.businesspartner_contact_id == '') {

      this.ModalContactParse.create_by = this.httpService.currentUser.employee_id;
      this.ModalContactParse.create_datetime = new Date();

      this.httpService.http_api_post('company/businesspartner/contact', this.ModalContactParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.ModalFormContact.patchValue({
              ...this.copying(this.ModalContactParse),
              businesspartner_contact_id: value.data.lastId,
              businesspartner_contact_code: value.data.businesspartner_contact_code
            })

            this.modalOut();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.ModalUpdateContact();
    }
  }

  ModalUpdateContact() {

    this.httpService.http_api_put('company/businesspartner/contact', this.ModalContactParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.ModalFormContact.value.is_active == 0) {
            this.modalHide();
          } else {
            this.ModalFormContact.patchValue({ ...this.copying(this.ModalContactParse) });
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

  ModalDeleteContact() {
    if (confirm("Are you sure to delete this data?")) {
      this.ModalFormContact.patchValue({ is_active: 0 });
      this.ModalFormSubmit();
    }
  }

}
