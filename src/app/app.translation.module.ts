import { NgModule, Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { Headers, Http, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CustomTranslateLoader implements TranslateLoader {


  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(private http: Http) { }
  getTranslation(lang: any): Observable<any> {
    var contentHeader = new Headers({ 'Authorization': localStorage.getItem('currentUser'), 'Company': localStorage.getItem('currentCompany'), 'Customer': localStorage.getItem('currentCustomer'), version: '1.0' })
    var apiAddress = localStorage.getItem('server') + '/api/apps/' + 'componentgenerate/' + lang.lang;
    return Observable.create(observer => {
      this.http.get(apiAddress, { headers: contentHeader }).subscribe((res: Response) => {
        observer.next(res.json());
        observer.complete();
      },
        error => {
          this.http.get("/assets/i18n/en.json").subscribe((res: Response) => {
            observer.next(res.json());
            observer.complete();
          })
        }
      );
    });
  }

}

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [Http]
      }
    })
  ],
  exports: [TranslateModule],
  providers: [TranslateService]
})
export class AppTranslationModule {
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    private translate: TranslateService,
    private router: Router,
  ) {

  }
}
