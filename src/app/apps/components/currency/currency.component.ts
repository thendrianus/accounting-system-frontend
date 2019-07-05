import { Component, Output, Input, EventEmitter } from '@angular/core';
import { HttpService } from '../../../';
@Component({
  selector: 'currency',
  styleUrls: ['./currency.scss'],
  templateUrl: './currency.html'
})
export class Currency {
  @Output() setCurrency: EventEmitter<string> = new EventEmitter<string>();
  @Output() setCurrencyData: EventEmitter<any> = new EventEmitter<any>();
  @Input() classInput = ''
  @Input() disableInput = true
  
  currency: any = [];
  selectedCurrency: string = '';

  constructor(
    protected httpService: HttpService,
  ) {
    this.httpService.http_api_post('apps/currency/select', { is_use: '1' })
      .subscribe((value) => {
        if (value.success) {
          this.currency = value.data.currency;
          if (this.currency.length > 0) {
            this.selectedCurrency = this.currency[0].currency_id;
            this.currencyChange();
          }
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};

        });
  }

  currencyChange() {
    
    this.setCurrency.emit(this.selectedCurrency);
    this.setCurrencyData.emit(this.currency.find(x => x.currency_id === this.selectedCurrency));

  }
}
