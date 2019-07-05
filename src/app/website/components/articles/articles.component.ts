import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
// import { UploaderOptions } from 'ngx-uploader';
import * as moment from 'moment';

@Component({
  selector: 'articles',
  styleUrls: ['./articles.scss'],
  templateUrl: './articles.html'
})
export class Articles {

  @ViewChild('childModal') public childModal: ModalDirective;

  public modalIn = '';

  public minDate: Date = void 0;
  public dateDisabled: { date: Date, mode: string }[];

  datetimeModel = { date: { year: 2018, month: 6, day: 23 }, time: new Date() };
  public data: any = { article_category_id: '' };

  closeResult: string;
  public articleCategory: any = [];
  formData: any;
  public inventoryCategory: any = {};
  currentUser: any = { employee_job_id: 0 };

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  public config = {
    uiColor: '#F0F3F4',
    height: '600',
    allowedContent: true,
  };

  public defaultPicture = 'assets/img/no-photo.png';
  // public uploaderOptions: UploaderOptions = {
  //   url: this.httpService.baseUrl + 'file',
  //   filterExtensions: true,
  //   allowedExtensions: ['jpg', 'png'],
  //   maxSize: 2097152,
  // };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };


  _formData = { times: new Date(), article_id: '', article_code: '', article_category_id: '', datetime: moment().format("YYYY-MM-DD"), app_image: '', title: '', subtitle: '', article: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    public httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {
    let newDate = new Date()
    this.formData = this.formBuilder.group({ //sssss
      times: `${newDate.getHours()}:${newDate.getMinutes()}`,
      article_id: '',
      article_code: '',
      article_category_id: [this.data.article_category_id, [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      datetime: moment().format("YYYY-MM-DD"),
      app_image: '',
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      subtitle: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      article: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formData');
    console.log(this.formData);
  }

  gen: any = { "app_component_id": 0, "_title": "Article", "_modaltitle": "Article Search", "ph_title": "Article Title", "ph_subtitle": "Article Subtitle", "ph_description": "Description", "at_title": "Title", "at_subtitle": "Subtitle", "at_dates": "Date", "at_article": "Article", "at_description": "Description", "at_category": "Category", "at_image": "app_image", "at_code": "Article Code", "btn_search": "Search Article", "btn_clear": "Clear All", "btn_add": "Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_close": "Close" };

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
    this.httpService.getTranslate('1').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.getPageCategory();
          this.inventoryCategory = { inventory_category_id: '2', category: 'Fix Asset' };
          this.clearAll();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  clearAll() {
    this.httpService.d = new Date();
    this.datetimeModel = this.httpService.datetimeModel();
    this.setarticlesdata(false);

    if (this.httpService.componentgenerated.ArticlesINWebsiteModule) {
      this.gen = JSON.parse(this.httpService.componentgenerated.ArticlesINWebsiteModule.generated);
    }


  }

  getPageCategory() {
    this.articleCategory = JSON.parse("[]");
    this.httpService.http_api_get('website/article/category/').subscribe((value) => {
      if (value.success) {
        this.articleCategory = value.data.category;
        if (this.articleCategory[0]) {
          this.data.article_category_id = this.articleCategory[0].article_category_id;
          this._formData.article_category_id = this.articleCategory[0].article_category_id;
          this.formData.patchValue({ article_category_id: this.articleCategory[0].article_category_id });
        }
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  modalShow() {
    this.modalIn = this.data.article_category_id;
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut(event) {
    this.setarticlesdata(event);
    this.datetimeModel = this.httpService.resetDatetime(this.formData.value.datetime);
    this.modalHide();
  }
  articleParse: any = {};
  submitArticle() {

    this.articleParse = this.copying(this.formData.getRawValue());
    this.articleParse.update_by = this.httpService.currentUser.employee_id;
    this.articleParse.update_datetime = new Date();

    this.articleParse.article_datetime = this.articleParse.datetime.toString();

    if (this.formData.value.article_id == '') {
      this.articleParse.create_by = this.httpService.currentUser.employee_id;
      this.articleParse.create_datetime = new Date();

      this.httpService.http_api_post('website/article', this.articleParse)
        .subscribe((value) => {
          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.articleParse.article_id = value.data.lastId;
            this.articleParse.article_code = value.data.article_code;
            this.setarticlesdata(this.articleParse);

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });

    } else {
      this.updateArticle();
    }
  }

  updateArticle() {

    this.httpService.http_api_put('website/article', this.articleParse)
      .subscribe((value) => {

        if (value.success) {

          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.articleParse.is_active == 0) {
            this.clearAll();
          } else {
            this.setarticlesdata(this.articleParse);
          }

        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  deleteSubmitForm() {
    if (confirm("Are you sure to delete this data?")) {
      this.formData.patchValue({ is_active: 0 });
      this.submitArticle();
    }
  }

  setarticlesdata(data) {
    if (data) {
      data.datetime = moment(data.datetime).format("YYYY-MM-DD")
      this.formData.patchValue(this.copying(data));
    } else {
      // this.formData.reset(this._formData)
    }
  }


  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload app_image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      this.formData.patchValue({ app_image: JSON.parse(data.response)[0].filename });
    }
  }

  articleCategoryChange() {
    if (this.formData.value.article_id == '') {
      this.formData.patchValue({ article_category_id: this.data.article_category_id })
    }
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }


}
