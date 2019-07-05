import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map'

@Injectable()
export class HttpService {
  public d = new Date();
  public baseUrl: string;
  public serverUrl: string;
  public baseAssetsDisc: string;
  public currentUser = { username: 'no user', employee_id: '', profile_picture: 'assets/img/avatars/6.jpg', employee_job_id: 0, company_id: 1, employee_account_id: '', purchase_role: 2, sale_role: 1 };
  private headers;
  public defaultCurrency: string = 'IDR';
  public app_version: string = 'Beta 0.1';

  public componentgenerated: any = {};

  constructor(
    private http: Http,
    private router: Router,
    private translate: TranslateService
  ) {
    // this.http = http;
    if (localStorage.getItem('server')) {
      this.serverUrl = localStorage.getItem('server') + '/';
    } else {
      this.serverUrl = 'http://localhost:50000/';
    }
    this.baseUrl = this.serverUrl + 'api/';
    this.baseAssetsDisc = this.serverUrl + 'assets/';

  }

  getTranslate(url) {
    return this.translate.get(url);
  }

  setLang(lang) {
    lang.authorization = localStorage.getItem('currentUser');
    lang.version = this.app_version;
    lang.company = localStorage.getItem('currentCompany');
    this.translate.addLangs([lang]);
    this.translate.setDefaultLang(lang);
    this.translate.getTranslation(lang);
  }

  http_api_post(url, data) {
    return this.http.post(this.baseUrl + url, data, this.jwt())
      .map(response => response.json())
  }

  http_api_put(url, data) {
    return this.http.put(this.baseUrl + url, data, this.jwt())
      .map(response => response.json())
  }

  http_api_get(url) {
    return this.http.get(this.baseUrl + url, this.jwt())
      .map(response => response.json())
  }

  http_api_get2(url) {
    return this.http.get(this.baseUrl + url, this.jwt());
  }

  login(values) {
    return this.http.post(this.baseUrl + 'app/login', values, this.jwt())
      .map(response => response.json());
  }

  modal_scroll_top(){
    const classElement = document.getElementsByClassName('modal');
    if(classElement.length > 0){
      classElement[0].scrollTop = 0;
    }
    const classElement2 = document.getElementsByClassName('app-body');
    if(classElement2.length > 0){
      classElement2[0].scrollTop = 0;
    }
  }

  is_authorization: boolean = false;
  authorization(bool) {

    return new Promise((resolve, reject) => {

      if (localStorage.getItem('server')) {

        this.baseUrl = localStorage.getItem('server') + '/api/';
        this.baseAssetsDisc = localStorage.getItem('server') + '/assets/';

        this.http.post(this.baseUrl + 'authorization', {}, this.jwt())
          .map(response => response.json()).subscribe((value) => {

            if (!value.login) {
              if (bool) {
                this.router.navigateByUrl('/login');
              }
              localStorage.removeItem('currentUser');
              localStorage.removeItem('currentCompany');

              resolve(false);
            } else {

              value.data.profile_picture = this.baseAssetsDisc + 'account/' + value.data.profile_picture;

              localStorage.setItem('profile_picture', value.data.profile_picture);
              localStorage.setItem('username', value.data.username);

              value.data.purchase_role = 1; //changethis
              value.data.sale_role = 1; //changethis
              this.currentUser = value.data;

              if (localStorage.getItem('server')) {

                if (localStorage.getItem('language')) {

                  if (value.data.employee_id == 1) {
                    this.setLang({ lang: localStorage.getItem('language'), group: 'asdf', currentCompany: localStorage.getItem('currentCompany') });
                  } else {
                    this.setLang({ lang: localStorage.getItem('language'), group: value.data.employee_account_id, currentCompany: localStorage.getItem('currentCompany') });
                  }


                } else {
                  localStorage.setItem('language', "en");
                  if (value.data.employee_id == 1) { // need to change
                    this.setLang({ lang: 'en', group: 'asdf', currentCompany: localStorage.getItem('currentCompany') });
                  } else {
                    this.setLang({ lang: 'en', group: value.data.employee_account_id, currentCompany: localStorage.getItem('currentCompany') });
                  }
                }

                this.is_authorization = true;

              } else {
                console.log('go to login');
                this.router.navigateByUrl('/login');
              }

              resolve(true);
            }
          },
            error => {
              //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
              console.log(error);
              console.log('2');
              this.router.navigateByUrl('/login');
            });

      } else {
        if (bool) {
          this.router.navigateByUrl('/login');
        } else {
          resolve(false);
        }
      }
    });

  }

  goToDashboard() {
    console.log('go to dashpbasre')
    this.router.navigateByUrl('/ts/dashboard');
  }

  private jwt() {
    this.headers = new Headers({ 'Authorization': localStorage.getItem('currentUser'), 'Company': localStorage.getItem('currentCompany'), 'Customer': localStorage.getItem('currentCustomer'), version: this.app_version });
    return new RequestOptions({ headers: this.headers });
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCompany');
  }

  datetimeModel() {
    return {
      date: { year: this.d.getFullYear(), month: this.d.getMonth() + 1, day: this.d.getDate() },
      time: this.d
    }
  }

  setDatetime(datetimeModel) {
    this.d.setFullYear(datetimeModel.date.year, datetimeModel.date.month - 1, datetimeModel.date.day);
    this.d.setHours(datetimeModel.time.getHours(), datetimeModel.time.getMinutes(), 1);
    return this.d;
  }

  setDate(datetimeModel) {
    this.d.setFullYear(datetimeModel.date.year, datetimeModel.date.month - 1, datetimeModel.date.day);
    return this.d;
  }

  resetDatetime(datetimeModel) {
    return {
      date: { year: datetimeModel.getFullYear(), month: datetimeModel.getMonth() + 1, day: datetimeModel.getDate() },
      time: datetimeModel
    }
  }

  resetDate(datetimeModel) {
    return { year: datetimeModel.getFullYear(), month: datetimeModel.getMonth() + 1, day: datetimeModel.getDate() }
  }

  success: any = {
    timeOut: 5000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 150,
    position: ["bottom", "right"],
    lastOnBottom: true,
  };

  alert: any = {
    timeOut: 25000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 150,
    position: ["bottom", "right"],
    lastOnBottom: true,
  }

  error: any = {
    timeOut: 50000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 150,
    position: ["bottom", "right"],
    lastOnBottom: true,
  }

  info: any = {
    timeOut: 10000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 150,
    position: ["bottom", "right"],
    lastOnBottom: true,
  }

  warn: any = {
    timeOut: 50000,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 150,
    position: ["bottom", "right"],
    lastOnBottom: true,
  }

  generateng2columns(columns) {
    var col = {}
    var count = 1;
    for (var key in columns) {

      if (columns[key].show == "1") {
        col[key] = columns[key];
      }

      if (count == Object.keys(columns).length) {
        return col;
      } else {
        count += 1;
      }
    }
  }

}
