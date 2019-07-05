import { Component } from '@angular/core';
import { HttpService } from '../../../../';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table

@Component({
  selector: 'bbaccount',
  templateUrl: './bbaccount.html',
})
export class Bbaccount {

  public glTransactionGlLinkId: string = "";
  inputGllist: string = '';
  inputHideAction: boolean = true;
  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };
  constructor(
    protected httpService: HttpService,
  ) {

  }

  refreshComponent() {
    this.ngOnInit();
    this.clearAll();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Beginning Account", "btn_clear_data": "Clear Data", "th_account_code": "Account Code", "th_account": "Account", "th_ballance": "Ballance", "td_detail": "Detail", "td_edit": "Edit" };

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
    this.httpService.getTranslate('18').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          //this.httpService.authorization(true);
          this.gen = value;
          this.settings = Object.assign({}, this.mySettings())
          this.currentUser = this.httpService.currentUser;
          this.getBbaccountList();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  ballance: number = 0;
  getBbaccountList() {
    this.httpService.http_api_get('accounting/bbaccount/').subscribe((value) => {

      if (value.success) {
        this.source.load(value.data.BbaccountList);
        this.ballance = 0
        for (const item of value.data.BbaccountList) {
          this.ballance += item.ballance;
        }
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
      },
      mode: 'inline',
      delete: {
        deleteButtonContent: '<a class="status-button btn btn-sm btn-success">' + this.gen.td_detail + '</a>',
        confirmDelete: true,
      },
      edit: {
        editButtonContent: '<a class="status-button btn btn-sm btn-warning">' + this.gen.td_edit + '</a>',
        confirmSave: true,
      },
      columns: this.httpService.generateng2columns({
        account_code: {
          title: this.gen.th_account_code,
          type: 'string',
          editable: false,
          show: 1
        },
        account: {
          title: this.gen.th_account,
          type: 'string',
          editable: false,
          show: 1
        },
        currency_id: {
          title: '*(Currency',
          type: 'string',
          editable: false,
          show: 1
        },
        ballance_plus: {
          title: this.gen.th_ballance,
          valuePrepareFunction: (value) => { return value === 'Total' ? value : Intl.NumberFormat('en-US').format(value) },
          type: 'number',
          show: 1
        },
      }),
      pager: {
        perPage: 75
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();

  newDataParse: any = {};
  editConfirm(event) {
    console.log(event)
    this.newDataParse = this.copying(event.newData);

    var nominal = 0;
    if (this.newDataParse.ballance >= 0) {
      nominal = Number(this.newDataParse.ballance_plus) - Number(this.newDataParse.ballance);
    } else {
      nominal = Number(this.newDataParse.ballance_plus) + Number(this.newDataParse.ballance);
    }

    if (event.data.plus == 1) {
      this.newDataParse.debit = nominal;
      this.newDataParse.credit = 0;
    } else {
      this.newDataParse.debit = 0;
      this.newDataParse.credit = nominal;
    }

    this.newDataParse.create_by = this.httpService.currentUser.employee_id;
    this.newDataParse.create_datetime = new Date();

    this.httpService.http_api_post('accounting/bbaccount', this.newDataParse).subscribe((value) => {
      console.log(value)
      if (value.success) {
        event.confirm.resolve();
        if (this.glTransactionGlLinkId != this.newDataParse.general_journal_id) {
          this.glTransactionGlLinkId = this.newDataParse.general_journal_id
        } else {
          this.outGllist();
        }
        this.getBbaccountList();
      } else {
        event.confirm.reject();
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });

  }

  deleteConfirm(event) {
    event.confirm.reject();
    this.glTransactionGlLinkId = event.data.account_id;
    this.outGllist();
  }

  outGllist() {
    this.inputGllist = Math.random().toString();
  }

  outputClearall: string = '';
  clearAll() {
    this.glTransactionGlLinkId = '';
    this.outputClearall = Math.random().toString();
  }

}
