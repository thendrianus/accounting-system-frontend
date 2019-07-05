import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'gllist',
  templateUrl: './gllist.html',
})
export class Gllist {

  @Input() glTransactionGlLinkId: string = '';

  @Input() glTransactionbbAccountId: string = '';

  @Input() outputClearall: any = {};

  @Input() inputGllist: string = '';

  @Output() editGL = new EventEmitter();

  @Input() inputHideAction: boolean = false;

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  debit = 0;
  credit = 0;

  ngOnChanges(changes: any) {

    if (changes.glTransactionGlLinkId) {
      if (changes.glTransactionGlLinkId.currentValue != "") {
        this.getgllistdetails({ action: 'general_journal_id', id: changes.glTransactionGlLinkId.currentValue });
      }
    }

    if (changes.glTransactionbbAccountId) {
      if (changes.glTransactionbbAccountId.currentValue != "") {
        this.getgllistdetails({ action: 'bbaccount_id', id: changes.glTransactionbbAccountId.currentValue });
      }
    }

    if (changes.inputGllist) {
      if (!changes.inputGllist.firstChange) {
        if (this.glTransactionGlLinkId != '') {
          this.getgllistdetails({ action: 'general_journal_id', id: this.glTransactionGlLinkId });
        } else {
          this.getgllistdetails({ action: 'bbaccount_id', id: this.glTransactionbbAccountId });
        }
      }
    }

    if (changes.outputClearall) {
      if (!changes.outputClearall.firstChange) {
        this.clearAll();
      }
    }

  }

  public defaultGeneralledgers = [];

  public generalledgers: any = this.copying(this.defaultGeneralledgers);

  formGeneralledger: any;

  _formGeneralledger = { general_journal_id: '', account_id: '', account_code: '', account: '', debit: 0, credit: 0, }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formGeneralledger = this.formBuilder.group({
      general_journal_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      account_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(11)]],
      account_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      account: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      debit: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      credit: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    });

  }

  printConsoleForm() {
    console.log('this.formGeneralledger');
    console.log(this.formGeneralledger);
    console.log('this.generalledgers');
    console.log(this.generalledgers);
  }

  gen: any = { "app_component_id": 0, "_nodata": "No Data", "th_no_account": "No Account", "th_account": "Account", "th_debit": "Debit", "th_credit": "Credit", "td_edit": "Edit" };

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
    this.httpService.getTranslate('66').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  gllistAccount: any = [];

  getgllistdetails(selectedGllist) {
    console.log(selectedGllist)
    if (selectedGllist) {
      this.httpService.http_api_post('accounting/generaljournal/gllist', selectedGllist)
        .subscribe((value) => {
          console.log(value)
          if (value.success) {
            this.generalledgers = value.data.gllist;
            this.sumBallace();
          }

        },
          error => {
            //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          });
    }
  }

  sumBallace() {

    this.debit = 0;
    this.credit = 0;
    for (const item of this.generalledgers) {
      this.debit += item.debit;
    }
    for (const item of this.generalledgers) {
      this.credit += item.credit;
    }

  }

  editGeneralledger(item) {
    this.editGL.emit(this.copying(item));
  }

  clearAll() {

    this.generalledgers = this.copying(this.defaultGeneralledgers);
    this.glTransactionGlLinkId = '';
    this.debit = 0;
    this.credit = 0;
  }

}
