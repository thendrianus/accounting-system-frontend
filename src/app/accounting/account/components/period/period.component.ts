import { Component } from '@angular/core';
import { HttpService } from '../../../../';

@Component({
  selector: 'period',
  styleUrls: ['./period.scss'],
  templateUrl: './period.html',
})
export class Period {

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


  gen: any = { "app_component_id": 0, "_title": "Period" };

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
    this.httpService.getTranslate('69').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getPeriod();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )

  }

  generalledgerPeriod: any = [];
  getPeriod() {

    this.httpService.http_api_post('accounting/generalledgerperiod', {})
      .subscribe((value) => {

        if (value.success) {
          this.generalledgerPeriod = value.data.generalledgerPeriod
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  closePeriod(item) {

    item.update_by = this.httpService.currentUser.employee_id;
    item.update_datetime = new Date();

    this.httpService.http_api_put('accounting/generalledgerperiod', item)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          this.getPeriod();
        } else {
          this.notif.warn = { title: 'Warning', content: value.label, setting: this.httpService.warn, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

}
