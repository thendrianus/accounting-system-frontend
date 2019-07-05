import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CHECKBOX_VALUE_ACCESSOR } from '@angular/forms/src/directives/checkbox_value_accessor';

@Component({
  selector: 'account',
  styleUrls: ['./account.scss'],
  templateUrl: './account.html',
})
export class Account {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public accounts: any = [];
  public accountHeaders: any = [];
  category: any = [];
  categoryType: any = [];
  isAccountBank: boolean = true;
  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _ModalFormAccount = { account_id: '', account_code: '', is_use: 1, account: '', is_header: '0', isAccountBank: true, account_category_type_id: '', account_category_id: '', description: '-', currency_id: '', create_by: '', update_by: '', create_datetime: new Date(), update_datetime: new Date(), is_active: 1 }

  _ModalFormBank = { account_bank_id: '', account_bank_code: '', account_id: '', bank_name: '', account_name: '', account_number: '0', bank_branch: '-', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  ModalFormAccount;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder
  ) {

    this.ModalFormAccount = this.formBuilder.group({
      account_id: [''],
      account_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      is_use: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      account: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      is_header: ['0', [Validators.minLength(0), Validators.maxLength(2)]],
      isAccountBank: [true, [Validators.minLength(0), Validators.maxLength(20)]],
      account_category_type_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      account_category_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      currency_id: [''],
      create_by: [''],
      update_by: [''],
      create_datetime: [new Date()],
      update_datetime: [new Date()],
      is_active: [1]
    });

    this.ModalFormBank = this.formBuilder.group({
      account_bank_id: '',
      account_bank_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account_id: '',
      bank_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      account_name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      account_number: ['0', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      bank_branch: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      is_active: 1
    });

    // this.disableInput.account_code= true;
  }

  refreshComponent() {
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.ModalFormAccount');
    console.log(this.ModalFormAccount);
    console.log('this.ModalFormBank');
    console.log(this.ModalFormBank);
  }
  gen: any = { "app_component_id": 0, "_title": "Account", "_modal1title": "Modal Title", "_modal2title": "Modal Title", "ph_account_numberModal1": "Account Number", "ph_accountModal1": "Account", "ph_descriptionModal1": "Description", "ph_bankcodeModal2": "Bank Code", "ph_banknameModal2": "Bank Name", "ph_accountnameModal2": "Account Name", "ph_accountnumberModal2": "Account Number", "ph_bankbranchModal2": "Bank Branch", "ph_descriptionModal2": "Description", "at_categoryModal1": "Clasification", "at_typeModal1": "Type", "at_headerModal1": "Header", "at_bank_accountModal1": "Bank Account", "at_numberModal1": "Number", "at_accountModal1": "Account", "at_currencyModal1": "Currency", "at_descriptionModal1": "Description", "at_bank_nameModal2": "Bank Name", "at_account_nameModal2": "Account Name", "at_account_numberModal2": "Account Number", "at_bank_branchModal2": "Bank Branch", "at_descriptionModal2": "Description", "at_thisisheaderModal2": "This Is Header", "at_bankaccountModal2": "Bank Account", "btn_new_account": "Add New Account", "btn_closeModal1": "Close", "btn_addModal1": "Add", "btn_editModal1": "Edit", "btn_deleteModal1": "Delete", "btn_dataBankModal1": "Data Bank", "btn_closeModal2": "Close", "btn_addModal2": "Add", "btn_editModal2": "Edit", "btn_deleteModal2": "Delete", "th_action": "Action", "th_code": "Code", "th_name": "Name", "th_type": "Type", "th_currency": "Currency", "th_tax": "Tax", "th_linked": "Linked", "th_ballance": "Ballance", "td_edit": "Edit" };

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
    this.httpService.getTranslate('16').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getAccount();
          this.getCategoryType();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  tabset: any = [];
  getAccount() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 0, account_category_id: 0 })
      .subscribe(
        value => {
          if (value.success) {
            this.tabset = JSON.parse("[]");
            this.accounts = JSON.parse("[]");
            for (const item1 of value.data.category) {
              if (item1.accounts == '[]') {
                item1.accounts = JSON.parse(item1.accounts);
              }
              for (const item of value.data.account) {
                if (item.account_category_id == item1.account_category_id) {
                  item1.accounts.push(this.copying(item));
                }
              }
              this.accounts.push(this.copying(item1));
              console.log(this.accounts)
            }
            this.tabset = [{}];
          }
        },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        }
      );
  }


  modalShow(item) {

    this.ModalHeader = 'Account Detail';

    if (item == '') {
      this.ModalFormAccount.reset(this._ModalFormAccount);
      this.ModalHeader = this.gen._modal1title;
      this.countAccountCode();
    } else {
      this.ModalFormAccount.patchValue({ ...item });
      this.ModalHeader = this.gen._modal1title2;
    }

    if (item.account_bank_id) {
      this.isAccountBank = true;
    } else {
      this.isAccountBank = false;
    }
    this.childModal.show();

    this.categoryChange();

  }

  accountCodeParse = 0;

  countAccountCode() {
    this.accountCodeParse = 10000;
    this.ModalFormAccount.patchValue({ account_code: 10000 });
    for (const item of this.accounts) {
      if (item.account_category_id == this.ModalFormAccount.value.account_category_id) {
        for (const item2 of item.accounts) {
          if (Number(item2.account_code)) {
            if (Number(item2.account_code) >= Number(this.accountCodeParse)) {

              this.accountCodeParse = Number(item2.account_code);

              var a = Number(item2.account_code);

              if ((a / 10) % 1 != 0) {
                this.ModalFormAccount.patchValue({ account_code: Number(item2.account_code) + 1 });
              } else if ((a / 100) % 1 != 0) {
                this.ModalFormAccount.patchValue({ account_code: Number(item2.account_code) + 10 });
              } else if ((a / 1000) % 1 != 0) {
                this.ModalFormAccount.patchValue({ account_code: Number(item2.account_code) + 100 });
              } else if ((a / 10000) % 1 != 0) {
                this.ModalFormAccount.patchValue({ account_code: Number(item2.account_code) + 1000 });
              } else if ((a / 100000) % 1 != 0) {
                this.ModalFormAccount.patchValue({ account_code: Number(item2.account_code) + 10000 });
              }

            }
          }
        }
      }
    }
  }

  checkAccountCode(event) {
    if (!Number(this.ModalFormAccount.value.account_code || this.ModalFormAccount.value.account_code.length < 5)) {
      this.countAccountCode();
    } else if (this.ModalFormAccount.value.account_code.length > 5) {
      this.ModalFormAccount.patchValue({ account_code: this.ModalFormAccount.value.account_code.substring(0, 5) });
    }
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.getAccount();

    this.modalHide();
  }

  public ModalHeader: string;


  ModalAccountParse;

  ModalFormSubmit() {

    this.ModalAccountParse = this.copying(this.ModalFormAccount.getRawValue());
    this.ModalAccountParse.create_by = this.httpService.currentUser.employee_id;
    this.ModalAccountParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalAccountParse.update_datetime = new Date();
    this.ModalAccountParse.create_datetime = new Date();

    if (this.ModalAccountParse.account_id == '') {
      this.httpService.http_api_post('accounting/account', this.ModalAccountParse)
        .subscribe(
          value => {
            if (value.success) {
              this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
              this.ModalFormAccount.patchValue({ ...this.copying(this.ModalAccountParse) });
              this.ModalFormAccount.patchValue({ account_id: value.data.lastId });
              if (!this.isAccountBank) {
                this.modalOut();
              }
            } else {
              this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
            }

          },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          }
        );
    } else {
      this.ModalUpdateAccount();
    }

  }

  ModalUpdateAccount() {

    this.ModalAccountParse = this.copying(this.ModalFormAccount.getRawValue());
    this.ModalAccountParse.update_by = this.httpService.currentUser.employee_id;
    this.ModalAccountParse.update_datetime = new Date();

    this.httpService.http_api_put('accounting/account', this.ModalAccountParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.ModalFormAccount.value.is_active == 0) {
            this.modalHide();
          } else {
            this.ModalFormAccount.patchValue({ ...this.copying(this.ModalAccountParse) });
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

  ModalDeleteAccount() {
    if (confirm("Are you sure to delete " + this.ModalFormAccount.value.account_code + " " + this.ModalFormAccount.value.account + "?")) {
      this.ModalFormAccount.patchValue({
        is_active: 0
      })
      this.ModalUpdateAccount();
    }
  }

  ModalSetCategorytype(event) {

    this.ModalFormAccount.patchValue({ account_category_type_id: event.account_category_type_id });
    this._ModalFormAccount.account_category_type_id = event.account_category_type_id;

  }

  ModalSetCurrency(event) {
    this.ModalFormAccount.patchValue({ currency_id: event });
    this._ModalFormAccount.currency_id = event;
  }

  categorytypeChange() {
    this.ModalSetCategorytype(this.ModalFormAccount.getRawValue());
    // this.countAccountCode();
  }

  categoryChange() {
    this.ModalFormAccount.patchValue({ account_category_type_id: '' });
    for (const item of this.category) {
      if (this.ModalFormAccount.value.account_category_id == item.account_category_id) {
        this.categoryType = item.type;
        this._ModalFormAccount.account_category_type_id = item.type[0].account_category_type_id;
        this.ModalFormAccount.patchValue({ account_category_type_id: item.type[0].account_category_type_id });
      }
    }

    if (this.ModalFormAccount.value.account_id == '') {
      this.ModalFormAccount.patchValue({
        is_header: 1
      });

      for (const item of this.accounts) {
        if (this.ModalFormAccount.value.account_category_id == item.account_category_id) {

          for (const item2 of item.accounts) {
            if (item2.is_header == 1) {
              this.ModalFormAccount.patchValue({ is_header: 0 });
            }
          }

        }
      }

    }

  }

  getCategoryType() {
    this.httpService.http_api_get('accounting/account/category/')
      .subscribe((value) => {
        if (value.success) {

          this.category = JSON.parse("[]");
          for (const item1 of value.data.category) {
            if (item1.type == '[]') {
              item1.type = JSON.parse(item1.type);
            }
            for (const item of value.data.type) {
              if (item.account_category_id == item1.account_category_id) {
                item1.type.push(this.copying(item));
              }
            }
            this.category.push(this.copying(item1));
            if (this.category.length == 1) {
              this.ModalFormAccount.patchValue({ account_category_id: this.category[0].account_category_id });
            }
          }

        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  modal2Show() {
    this.ModalFormBank.reset({
      ...this._ModalFormBank,
      account_id: this.ModalFormAccount.value.account_id
    });
    this.getAccountBank();
    this.childModal2.show();
  }

  modal2Hide() {
    this.childModal2.hide();
  }

  modalOut2() {
    this.modal2Hide();
  }

  public Modal2Header: string;

  ModalFormBank;
  ModalBankParse;

  getAccountBank() {

    this.httpService.http_api_post('accounting/account/banks', { account_id: this.ModalFormAccount.value.account_id })
      .subscribe((value) => {
        if (value.success) {
          if (value.data.bank.length > 0) {
            this.ModalFormBank.patchValue({ ...value.data.bank[0] });
          }
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  Modal2FormSubmit() {

    this.ModalBankParse = this.copying(this.ModalFormBank.getRawValue());
    this.ModalBankParse.create_by = this.httpService.currentUser.employee_id;
    this.ModalBankParse.update_by = this.httpService.currentUser.employee_id;

    if (this.ModalBankParse.account_bank_id == '') {
      this.ModalBankParse.update_datetime = new Date();
      this.ModalBankParse.create_datetime = new Date();
      this.httpService.http_api_post('accounting/account/bank', this.ModalBankParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.ModalFormBank.patchValue({
              ...this.ModalBankParse,
              account_bank_id: value.data.lastId,
              account_bank_code: value.data.account_bank_code
            });
            this.modalOut2();
            this.modalOut();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.ModalUpdateBank();
    }

  }

  ModalUpdateBank() {

    this.ModalBankParse = this.copying(this.ModalFormBank.getRawValue());
    this.ModalBankParse.create_by = this.httpService.currentUser.employee_id;
    this.ModalBankParse.update_by = this.httpService.currentUser.employee_id;

    this.httpService.http_api_put('accounting/account/bank', this.ModalBankParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.ModalFormBank.value.is_active == 0) {
            this.modal2Hide();
          } else {
            this.ModalFormBank.patchValue({ ...this.ModalBankParse });
          }
          this.modalOut2();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  ModalDeleteBank() {
    if (confirm("Are you sure to delete " + this.ModalFormBank.value.account_bank_code + " " + this.ModalFormBank.value.bank_name + "?")) {
      this.ModalFormBank.patchValue({ is_active: 0 });
      this.Modal2FormSubmit();
    }
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getAccount();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

  tabActive: number = 0;

  activeTab(item, index) {
    this.tabActive = index;
    if (item) {
      this.ModalFormAccount.patchValue({ account_category_id: item.account_category_id });
      this._ModalFormAccount.account_category_id = item.account_category_id;
    }
  }

}
