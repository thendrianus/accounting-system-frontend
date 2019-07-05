import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'work_order',
  templateUrl: './work_order.html',
})
export class Work_order {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;
  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  datetimeModel2 = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formWork_order;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };
  _formWork_order = { work_order_id: '', work_order_detail: [], work_order_code: '', start_date: moment().format("YYYY-MM-DD"), expected_date: moment().format("YYYY-MM-DD"), pic: '', department_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  _ModalformWork_order = { work_order_detail_id: '', work_order_id: '', bom_id: '', bom: '', quantity: 1, status: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formWork_order = this.formBuilder.group({ //sssss
      work_order_id: '',
      work_order_detail: [],
      work_order_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      start_date: moment().format("YYYY-MM-DD"),
      expected_date: moment().format("YYYY-MM-DD"),
      pic: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      department_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.ModalformWork_order = this.formBuilder.group({ //sssss
      work_order_detail_id: '',
      work_order_id: '',
      bom_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      bom: '',
      quantity: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      status: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
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
    console.log('this.formWork_order');
    console.log(this.formWork_order);
    console.log('this.ModalformWork_order');
    console.log(this.ModalformWork_order);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Work Order", "_code": "Work Order Order", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "ph_code": "Work Order Code", "ph_description": "Description", "ph_quantityM1": "Quantity", "ph_descriptionM1": "Description", "at_code": "", "at_start_date": "Start Date", "at_expected_date": "Expected Date", "at_pic": "PIC", "at_department": "Department", "at_description": "Description", "at_conversion_costM1": "Conversion Cost", "at_quantityM1": "Quantity", "at_statusM1": "Status", "at_descriptionM1": "Description", "btn_add": " Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_add_cost": "", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_updateM1": "Update", "btn_closeM2": "Close", "th_action": "Action", "th_no": "No", "th_conversion_cost": "Conversion Cost", "th_new_cost": "New Cost", "th_codeTbl2": "", "th_start_dateTbl2": "Start Date", "th_expected_dateTbl2": "Expected Date", "th_descriptionTbl2": "Description", "td_edit": "Edit", "td_detailTbl2": "Detail" };

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
    this.httpService.getTranslate('32').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.work_order_code = true;
          this.getConversionCost();
          this.getEmployee();
          this.getDepartment();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  work_orderParse: any = {};

  formWork_orderSubmit() {

    this.work_orderParse = this.copying(this.formWork_order.getRawValue());
    this.work_orderParse.update_by = this.httpService.currentUser.employee_id;
    this.work_orderParse.update_datetime = new Date();

    this.work_orderParse.work_order_detail = this.work_order_details;

    if (this.work_orderParse.work_order_id == '') {
      this.work_orderParse.create_by = this.httpService.currentUser.employee_id;
      this.work_orderParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/work_order', this.work_orderParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setwork_order(this.work_orderParse);
            this.formWork_order.patchValue({
              work_order_id: value.data.work_order_id,
              work_order_code: value.data.work_order_code
            })

            this.getStandardCostDetail();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.formWork_orderUpdate();
    }

  }

  formWork_orderUpdate() {

    this.httpService.http_api_put('manufacture/work_order', this.work_orderParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formWork_order.value.is_active == 0) {
            this.clearAll();
          } else {
            this.setwork_order(this.work_orderParse);
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  Work_orderDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formWork_order.patchValue({ is_active: 0 });
      this.formWork_orderUpdate();
    }
  }


  getWork_orderList() {
    this.httpService.http_api_post('manufacture/work_order/select', { is_use: 0 }).subscribe(
      value => {
        if (value.success) {
          this.source.load(value.data.work_order);
        }
      },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      }
    );
  }

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        add: false,
        edit: false
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `${this.gen.td_select}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        work_order_code: {
          title: this.gen.tn_work_order_code,
          type: 'string',
          editable: false,
          show: 1
        },
        start_date_show: {
          title: this.gen.tn_start_date_show,
          type: 'string',
          show: 1
        },
        expected_date_show: {
          title: this.gen.tn_expected_date_show,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.tn_description,
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

  modal2Select(event) {
    this.setwork_order(event.data);
    this.getStandardCostDetail();
    this.modalHide2();
  }

  outGllist() {
    this.inputGllist = Math.random().toString();
  }

  outputClearall: string = '';
  clearAll() {
    this.outputClearall = Math.random().toString();
    this.glTransactionGlLinkId = '';
    this.work_order_details = JSON.parse("[]");
    this.setwork_order(false);
    this.ModalformWork_order.reset(this._ModalformWork_order);
  }

  edit() {

  }

  modalShow(item) {

    this.ModalHeader = 'Work_order Detail';

    if (item == '') {

      this.ModalformWork_order.reset(this._ModalformWork_order);

      this.ModalformWork_order.patchValue({ work_order_id: this.formWork_order.value.work_order_id });
      this.ModalHeader = this.gen._titleM1;
    } else {
      this.ModalformWork_order.patchValue(item);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2() {
    this.getWork_orderList();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {

    this.modalHide();
  }


  public ModalHeader: string;

  ModalformWork_order;
  work_order_details: any = [];

  getStandardCostDetail() {
    this.httpService.http_api_post('manufacture/work_order/detail', { work_order_id: this.formWork_order.value.work_order_id }).subscribe((value) => {

      if (value.success) {
        this.work_order_details = value.data.work_order_detail;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalFormSubmit() {

    this.ModalformWork_order.patchValue({
      update_by: this.httpService.currentUser.employee_id,
      update_datetime: new Date()
    })
    if (this.ModalformWork_order.value.work_order_detail_id == '') {
      this.work_order_details.push(this.copying(this.ModalformWork_order.getRawValue()));
    }

    this.modalOut();

  }

  setwork_order(data) {
    if (data) {
      data.expected_date = moment(data.expected_date).format("YYYY-MM-DD")
      data.start_date = moment(data.start_date).format("YYYY-MM-DD")
      this.formWork_order.patchValue(this.copying(data));
    } else {
      this.formWork_order.reset(this._formWork_order)
    }
  }

  bomData: any = [];
  getConversionCost() {
    this.bomData = JSON.parse("[]");
    this.httpService.http_api_post('manufacture/bom/select', { is_use: 1 }).subscribe((value) => {
      if (value.success) {

        this.bomData = value.data.bom;

      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  modalConversionCostIdChange(event) {
    console.log(event)
    this.ModalformWork_order.patchValue({ bom: event.bom });
  }

  employeeData: any = [];
  getEmployee() {
    this.httpService.http_api_post('hrd/employee/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.employeeData = value.data.employee;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  departmentData: any = [];
  getDepartment() {
    this.httpService.http_api_post('company/department/select', { is_use: '1' }).subscribe((value) => {

      if (value.success) {
        this.departmentData = value.data.department;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
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
