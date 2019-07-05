import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../../../';

@Component({
  selector: 'default-modal',
  styleUrls: [('./default-modal.component.scss')],
  templateUrl: './default-modal.component.html'
})

export class DefaultModal implements OnChanges {

  articles: any = [];
  selectedArticle: any = {};

  @Input() in: any = "";


  ngOnChanges(changes: any) {
    this.articleSearch(changes.in.currentValue);
  }

  @Output() out: EventEmitter<any> = new EventEmitter<any>();

  formData: any;
  constructor(
    // private activeModal: NgbActiveModal,
    protected httpService: HttpService,
  ) {

  }

  selectArticles(item) {
    item.newimage = this.httpService.baseAssetsDisc + 'articles/' + item.image;
    item.datetime = new Date(item.datetime);
    this.selectedArticle = item;
    this.out.emit(this.selectedArticle);
  }

  ngOnInit() {

  }

  articleSearch(id) {
    if (id != '') {
      this.httpService.http_api_post('website/article/search', { article_category_id: id }).subscribe((value) => {
        if (value.success) {
          this.articles = value.data.articles;
        }
      },
        error => {
          //  this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        });
    }

  }

}
