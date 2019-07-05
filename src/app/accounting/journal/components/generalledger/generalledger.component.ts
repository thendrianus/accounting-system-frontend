import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../../';
import { Location } from '@angular/common';
import { LocalDataSource } from 'ng2-smart-table'; //ng2-smart-table
import { Router, NavigationStart } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'generalledger',
  templateUrl: './generalledger.html',
  styleUrls: ['./generalledger.scss']
})
export class Generalledger {

  settings : any = {
    pager: {
      perPage: 75
    }
  };
  mySettings() {
    return {
      actions: {
        add: false,
        edit: false,
      },
      mode: 'external',
      delete: {
        deleteButtonContent: `Select`,
        confirmDelete: true,
      },
      columns: this.httpService.generateng2columns({
        account: {
          title: 'Account',
          type: 'string',
          show: 1
        },
        type_code: {
          title: 'Trx Type',
          type: 'string',
          show: 1
        },
        account_category_type: {
          title: 'Account Type',
          type: 'string',
          show: 1
        },
        reference_code: {
          title: 'Reference',
          type: 'string',
          show: 1
        },
        debit: {
          title: 'Debit',
          valuePrepareFunction: (value) => { return value === 'Total' ? value : Intl.NumberFormat('en-US').format(value) },
          type: 'number',
          show: 1
        },
        credit: {
          title: 'Credit',
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
  public source: LocalDataSource = new LocalDataSource();
  public generalLedger1: any = { show: true, label: '' };

  constructor(
    private httpService: HttpService,
    private router: Router,
    private location: Location,
    private sanitized: DomSanitizer
  ) {

  }

  refreshComponent() {
    this.ngOnInit();
  }

  ngOnInit() {

    window.scrollTo(0, 0);

    //this.httpService.authorization(true);

    this.getGeneralledger();

    this.router.events.subscribe(event => {

      if (event instanceof NavigationStart) {
        this.checkIfGeneralledger(event.url);
      }

    });

    var url2 = this.location.prepareExternalUrl(this.location.path()).substring(1);
    this.generalledgerUrl = url2.substring(0, url2.lastIndexOf('generalledger') + 13);
    this.checkIfGeneralledger(url2);
    this.settings = Object.assign({}, this.mySettings());

  }

  ballance: number = 0;

  generalledger: any = [];

  accountBallance: any = {
    type1: 0,
    type2: 0,
    type3: 0,
    type4: 0,
    type5: 0,
    type6: 0,
    type7: 0,
    type8: 0
  };
  getGeneralledger() {
    this.generalledger = JSON.parse("[]");
    this.httpService.http_api_get('accounting/generalledger/').subscribe((value) => {

      if (value.success) {
        this.generalledger = value.data.generalledger;
        this.source.load(value.data.generalledger);
        
        this.ballance = 0
        for (const item of this.generalledger) {

          this.accountBallance[`type${item.account_category_type_id}`] += item.debit - item.credit
          
          this.ballance += item.debit - item.credit;
        }

        this.source.refresh();
      }

    },
      error => {
        //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};

      });
  }

  reset() {
    this.source.reset(true);
  }

  selectGeneralledger(item) {
    var url = this.location.prepareExternalUrl(this.location.path());
    // this.router.navigate([ url.substring(1) + '/fixasset/', item.data.general_journal_id]);
    this.router.navigate([url.substring(1) + '/generaljournal/', item.data.general_journal_id]);
    // this.checkIfGeneralledger(url);
  }

  public generalledgerUrl: string = '';

  checkIfGeneralledger(url) {
    if (url.substring(url.length - 13) == 'generalledger') {
      this.generalLedger1.show = true;
      this.generalLedger1.label = 'true';
    } else {
      this.generalLedger1.show = false;
      this.generalLedger1.label = 'false'
    }
  }

  backClicked() {
    // this.location.back();
    this.router.navigate([this.generalledgerUrl]);
  }

}
