import { Component } from '@angular/core';
import { HttpService } from '../../../../';

@Component({
  selector: 'accountlink',
  templateUrl: './accountlink.html',
})
export class Accountlink {
  currentUser: any = { employee_job_id: 0 };
  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };
  constructor(
    protected httpService: HttpService,
  ) {

  }

  refreshComponent() {
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gen: any = { "app_component_id": 0, "_title": "Account Linked", "th_no": "No", "th_account_link": "Account_Link", "th_account": "Account", "th_action": "Action", "td_setaccountlink": "Set Account Link" };

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
    this.httpService.getTranslate('17').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getAccountlinkAccount();
          this.getAccountlink();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  accountlinkParse: any = {};
  submit(accountlink) {

    this.accountlinkParse = this.copying(accountlink);
    this.accountlinkParse.create_by = this.httpService.currentUser.employee_id;
    this.accountlinkParse.update_by = this.httpService.currentUser.employee_id;
    this.accountlinkParse.update_datetime = new Date();
    this.accountlinkParse.create_datetime = new Date();

    this.httpService.http_api_post('accounting/accountlink', this.accountlinkParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.getAccountlink();

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  accountLinkList: any = [];
  getAccountlink() {
    this.httpService.http_api_get('accounting/accountlink/')
      .subscribe((value) => {

        if (value.success) {

          this.accountLinkList = value.data.accountlink;

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  AccountlinkAccount: any = [];
  getAccountlinkAccount() {
    this.httpService.http_api_post('accounting/account/select', { is_use: 1, account_category_id: 0 }).subscribe((value) => {

      if (value.success) {
        this.AccountlinkAccount = value.data.account;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

}
