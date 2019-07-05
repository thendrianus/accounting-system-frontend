import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
// import { UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'company',
  styleUrls: ['./company.scss'],
  templateUrl: './company.html',
})
export class Company {

  date = new Date();

  currentUser: any = { employee_job_id: 0 };
  formCompany;
  company: any;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };
  _formCompany = { company_id: '', company_code: '', company: '', tax_number: '', company_image: '', oldimage: '', register_number: '', description: '-', ledgerfirst_month: 1, ledgerlast_month: 12, ledgeryear: this.date.getFullYear(), isledgeraudit: 1, update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private route: ActivatedRoute,
  ) {

    this.formCompany = this.formBuilder.group({ //sssss
      company_id: '',
      company_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      company: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      tax_number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      company_image: [''],
      oldimage: '',
      branch_id: [''],
      register_number: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      ledgerfirst_month: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      ledgerlast_month: [12, [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      ledgeryear: [this.date.getFullYear(), [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      isledgeraudit: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
      employee_account: '-',
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formCompany');
    console.log(this.formCompany);
  }

  public defaultPicture = 'assets/img/no-photo.png';

  // public uploaderOptions: UploaderOptions = {
  //   url: this.httpService.baseUrl + 'file',
  //   filterExtensions: true,
  //   allowedExtensions: ['jpg', 'png'],
  //   maxSize: 2097152,
  // };

  paramId: any = '';
  private subParam: any;
  showList: boolean = true;

  gen: any = { "app_component_id": 0, "_title": "Company", "ph_code": "Company Code", "ph_company": "Company", "ph_tax_number": "Taxt Number", "ph_register_number": "Register NUmber", "ph_image": "Picture", "ph_description": "Description", "at_code": "Company Code", "at_company": "Company", "at_tax_number": "Tax Number", "at_register_number": "Register Number", "at_image": "Picture", "at_description": "Description", "btn_add": "Add", "btn_update": "Update", "btn_delete": "Cancel Company", "btn_clear": "Clear All", "th_action": "Action", "th_company": "Company", "th_register": "register", "th_description": "Description", "td_edit": "Edit" };

  ngOnInit() {

    window.scrollTo(0, 0);

    //this.httpService.authorization(true);
    if (this.httpService.is_authorization) {
      this.getGen();
    } else {
      this.httpService.authorization(true).then(value => {
        this.getGen();
      });
    }

  }


  getGen() {
    this.httpService.getTranslate('6').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )

    this.subParam = this.route.params.subscribe(params => {
      if (params['id']) {
        this.paramId = params['id'];
        if (this.paramId == "list") {
          this.showList = true;
        } else {
          this.showList = false;
        }

      }
    });

    this.currentUser = this.httpService.currentUser;

    this.disableField();
    this.disableInput.company_code = true;
    this.getCompany();
  }
  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  companyData: any = [];
  getCompany() {
    this.httpService.http_api_post('company/company/select', { is_use: '0' })
      .subscribe((value) => {
        console.log(value)
        if (value.success) {
          this.companyData = value.data.company;
          if (!this.showList) {
            for (var key in this.companyData) {
              if (this.companyData[key].company_id == this.currentUser.company_id) {
                this.editCompany(this.companyData[key]);
              }
            }
          }

        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  companyParse: any;
  companySubmit() {

    this.companyParse = this.copying(this.formCompany.getRawValue());
    this.companyParse.update_by = this.httpService.currentUser.employee_id;
    this.companyParse.update_datetime = new Date();

    if (this.companyParse.company_id == '') {
      this.companyParse.create_by = this.httpService.currentUser.employee_id;
      this.companyParse.create_datetime = new Date();

      this.httpService.http_api_post('company/company', this.companyParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formCompany.patchValue({
              ...this.copying(this.companyParse),
              company_id: value.data.company_id,
              company_code: value.data.company_code,
              branch_id: value.data.branch_id,
              branch_code: value.data.branch_code,
            });
            this.disableField();

            this.getCompany();
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

    this.companyParse = this.copying(this.formCompany.getRawValue());
    this.companyParse.update_by = this.httpService.currentUser.employee_id;
    this.companyParse.update_datetime = new Date();
    console.log(this.companyParse);
    this.httpService.http_api_put('company/company', this.companyParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formCompany.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formCompany.patchValue({ ...this.copying(this.companyParse) });
            this.disableField();
          }
          this.getCompany();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  companyDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formCompany.patchValue({ is_active: 0 });
      this.companySubmit();
    }
  }

  clearAll() {
    this.formCompany.reset(this._formCompany);
    this.disableField();
  }

  editCompany(item) {
    console.log(item)
    if (item.company_image == '') {
      item.oldimage = 'assets/img/no-photo.png';
    } else {
      item.oldimage = this.httpService.baseAssetsDisc + 'company/' + item.company_image;
    }
    
    this.formCompany.patchValue({ ...this.copying(item) });
    this.disableField();
  }

  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload company_image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      this.formCompany.patchValue({ company_image: JSON.parse(data.response)[0].filename });
    }

  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getCompany();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

  checkLedgerYear(event) {

  }

  disableField() {
    if (this.formCompany.value.company_id == '') {
      this.disableInput.ledgerfirst_month = false;
      this.disableInput.ledgerlast_month = false;
      this.disableInput.ledgeryear = false;
      this.disableInput.isledgeraudit = false;
    } else {
      this.disableInput.ledgerfirst_month = true;
      this.disableInput.ledgerlast_month = true;
      this.disableInput.ledgeryear = true;
      this.disableInput.isledgeraudit = true;
    }
  }

  showLedgeryear1 = false;

  ledgerMonthChange() {

    if (Number(this.formCompany.value.ledgerfirst_month) > Number(this.formCompany.value.ledgerlast_month)) {
      this.showLedgeryear1 = true;
    } else {
      this.showLedgeryear1 = false;
    }
  }


}
