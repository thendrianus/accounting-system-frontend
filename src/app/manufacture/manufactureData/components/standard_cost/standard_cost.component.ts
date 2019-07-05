import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'standard_cost',
  templateUrl: './standard_cost.html',
})
export class Standard_cost {

  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('childModal2') public childModal2: ModalDirective;
  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;
  currentUser: any = { employee_job_id: 0 };

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };

  formStandard_cost;

  moneyOption = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: "."
  };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formStandard_cost = { standard_cost_id: '', standard_cost_detail: [], standard_cost_code: '', effective_date: moment().format("YYYY-MM-DD"), description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  _ModalformStandard_cost = { standard_cost_detail_id: '', standard_cost_id: '', conversion_cost_id: '', conversion_cost: '', new_cost: '', uom: '', currency_id: '', description: '-', create_by: '-', update_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, is_on_detail: 0 }

  disableInput: any = {}

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
    private sanitized: DomSanitizer
  ) {

    this.formStandard_cost = this.formBuilder.group({ //sssss
      standard_cost_id: '',
      standard_cost_detail: [],
      standard_cost_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      effective_date: moment().format("YYYY-MM-DD"),
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

    this.ModalformStandard_cost = this.formBuilder.group({ //sssss
      standard_cost_detail_id: '',
      standard_cost_id: '',
      conversion_cost_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      conversion_cost: '',
      new_cost: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      uom: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      currency_id: '',
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      create_by: '-',
      update_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
      is_on_detail: 0
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formStandard_cost');
    console.log(this.formStandard_cost);
    console.log('this.ModalformStandard_cost');
    console.log(this.ModalformStandard_cost);
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Standard Cost", "_code": "Standard Cost Code", "_titleM1": "Title Modal", "_titleM2": "Title Modal", "ph_code": "Product Result Code", "ph_description": "Description", "ph_new_costM1": "New Cost", "at_code": "Product Result Code", "at_date": "Date", "at_description": "Description", "at_conversion_costM1": "Conversion Cost", "at_new_costM1": "New Cost", "at_uomM1": "UOM", "at_descriptionM1": "Description", "btn_add": " Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_search": "Search", "btn_clear": "Clear All", "btn_add_inventory": "Add Item", "btn_closeM1": "Close", "btn_addM1": "Add ", "btn_editM2": "Edit", "btn_closeM2": "Close", "th_action": "Action", "th_no": "No", "th_conversion_cost": "Conversion Cost", "th_new_cost": "New Cost", "th_codeTbl2": "Standard Cost Code", "th_efective_dateTbl2": "Efective Date", "th_descriptionTbl2": "Description", "td_edit": "Edit", "td_detailTbl2": "Detail" };

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
    this.httpService.getTranslate('30').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.settings = Object.assign({}, this.mySettings());
          this.currentUser = this.httpService.currentUser;
          this.disableInput.standard_cost_code = true;
          this.disableInput.uom = true;
          this.getConversionCost();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  standard_costParse: any = {};

  formStandard_costSubmit() {

    this.standard_costParse = this.copying(this.formStandard_cost.getRawValue());
    this.standard_costParse.update_by = this.httpService.currentUser.employee_id;
    this.standard_costParse.update_datetime = new Date();

    this.standard_costParse.standard_cost_detail = this.modalStandardCosts;

    if (this.standard_costParse.standard_cost_id == '') {
      this.standard_costParse.create_by = this.httpService.currentUser.employee_id;
      this.standard_costParse.create_datetime = new Date();

      this.httpService.http_api_post('manufacture/standard_cost', this.standard_costParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.setstandard_cost(this.standard_costParse);
            this.formStandard_cost.patchValue({
              standard_cost_id: value.data.standard_cost_id,
              standard_cost_code: value.data.standard_cost_code
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
      this.formStandard_costUpdate();
    }

  }

  formStandard_costUpdate() {

    console.log(this.standard_costParse)
    this.httpService.http_api_put('manufacture/standard_cost', this.standard_costParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formStandard_cost.value.is_active == 0) {
            this.clearAll();
          } else {
            this.setstandard_cost(this.standard_costParse);
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  Standard_costDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formStandard_cost.patchValue({ is_active: 0 });
      this.formStandard_costUpdate();
    }
  }

  getStandard_costList() {
    this.httpService.http_api_post('manufacture/standard_cost/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.standard_cost);
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
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
        deleteButtonContent: `${this.gen.td_detailTbl2}`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        standard_cost_code: {
          title: this.gen.th_codeTbl2,
          type: 'string',
          editable: false,
          show: 1
        },
        effective_date_show: {
          title: this.gen.th_efective_dateTbl2,
          type: 'string',
          show: 1
        },
        description: {
          title: this.gen.th_descriptionTbl2,
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
    this.setstandard_cost(event.data);
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
    this.modalStandardCosts = JSON.parse("[]");
    this.setstandard_cost(false);
    this.ModalformStandard_cost.reset(this._ModalformStandard_cost);
  }

  edit() {

  }

  modalShow(item) {

    this.ModalHeader = 'Standard_cost Detail';

    if (item == '') {

      this.ModalformStandard_cost.reset(this._ModalformStandard_cost);

      this.ModalformStandard_cost.patchValue({ standard_cost_id: this.formStandard_cost.value.standard_cost_id });
      this.ModalHeader = this.gen._titleM1;

    } else {
      item.conversion_cost_id = "" + item.conversion_cost_id + "";
      this.ModalformStandard_cost.patchValue(item);
      this.ModalHeader = this.gen._titleM12;
    }

    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalShow2() {
    this.getStandard_costList();
    this.childModal2.show();
  }

  modalHide2() {
    this.childModal2.hide();
  }

  modalOut() {
    this.modalHide();
  }

  public ModalHeader: string;

  ModalformStandard_cost;
  modalStandardCosts: any = [];

  getStandardCostDetail() {
    this.httpService.http_api_post('manufacture/standard_cost/detail', { standard_cost_id: this.formStandard_cost.value.standard_cost_id }).subscribe((value) => {

      if (value.success) {
        this.modalStandardCosts = value.data.standard_cost_detail;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  ModalFormSubmit() {
    this.ModalformStandard_cost.patchValue({
      create_by: this.httpService.currentUser.employee_id,
      create_datetime: new Date()
    })
    if (this.ModalformStandard_cost.value.standard_cost_detail_id == '' && this.ModalformStandard_cost.value.is_on_detail == 0) {
      this.ModalformStandard_cost.patchValue({
        is_on_detail: 1
      })


      this.modalStandardCosts.push(this.copying(this.ModalformStandard_cost.getRawValue()));
    } else {

      for (let i in this.modalStandardCosts) {

        if (this.modalStandardCosts[i].conversion_cost_id == this.modalStandardCosts.conversion_cost_id) {
          this.modalStandardCosts[i] = this.ModalformStandard_cost.value;
        }

      }
    }

    this.modalOut();

  }

  setstandard_cost(data) {
    if (data) {
      data.effective_date = moment(data.effective_date).format("YYYY-MM-DD")
      this.formStandard_cost.patchValue(this.copying(data));
    } else {
      this.formStandard_cost.reset(this._formStandard_cost)
    }
  }

  conversionCostData: any = [];
  getConversionCost() {
    this.httpService.http_api_post('manufacture/conversion_cost/select', { is_use: '1' }).subscribe((value) => {
      if (value.success) {
        this.conversionCostData = value.data.conversion_cost;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  conversionCostAutofilled(event) {
    this.ModalformStandard_cost.patchValue({
      new_cost: event.cost,
      conversion_cost: event.conversion_cost,
      uom: event.uom,
      currency_id: event.currency_id,
    })

    this.moneyOption.prefix = event.currency_id + '. ';

    for (let e of this.modalStandardCosts) {
      if (e.conversion_cost_id == event.conversion_cost_id) {
        e.conversion_cost_id = "" + e.conversion_cost_id + "";
        this.ModalformStandard_cost.patchValue(e);
      }
    }
  }

  standardCostDetailDelete(index) {

    if (confirm("Are you sure to delete this?")) {
      this.modalStandardCosts.splice(index, 1);
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
