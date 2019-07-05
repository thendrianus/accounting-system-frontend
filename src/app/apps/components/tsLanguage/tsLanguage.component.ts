import { Component, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../';

@Component({
  selector: 'ts-language',
  styleUrls: ['./tsLanguage.scss'],
  templateUrl: './tsLanguage.html'
})
export class TsLanguage {
  @Output() setLanguage: EventEmitter<string> = new EventEmitter<string>();
  language: any = [];
  selectedLang: string = '';

  constructor(
    protected httpService: HttpService,
  ) {
    this.httpService.http_api_get('apps/language')
      .subscribe(
        value => {
          if (value.success) {
            this.language = value.data.language;
            if (this.language.length > 0) {
              this.selectedLang = this.language[0].language_id;
              this.langChange();
            }
          }
        },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};

        }
      );
  }

  langChange() {
    this.setLanguage.emit(this.selectedLang);
  }
}
