import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
// import { UploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.scss']
})
export class Pagination {

  @ViewChild('childModal') public childModal: ModalDirective;

  public defaultPageDetail = { template_detail_id: '', name: '', widget_id: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, };

  public defaultPageDetails = [];
  public defaultTemplateDetails = [];
  public defaultWidgetDetails = [];

  public pageDetail: any = this.copying(this.defaultPageDetail);
  public pageDetails: any = this.copying(this.defaultPageDetails);
  public templateDetails: any = this.copying(this.defaultTemplateDetails);
  public pageCategory: any = [];
  public templateList: any = [];
  public widgetDetails: any = this.copying(this.defaultWidgetDetails);
  currentUser: any = { employee_job_id: 0 };

  formPage: any;
  formPageDetail: any;

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

  _removePicture(index) {
    // this.formData._value.picture.splice(index, 1);
  }

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formPage = { category: '', page_id: '', page_code: '', page_category_id: '', name: '', template_id: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1, }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formPage = this.formBuilder.group({ //sssss
      category: [''],
      page_id: '',
      page_code: '',
      page_category_id: '',
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      template_id: [''],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1,
    });

  }

  refreshComponent() {
    this.clearAll();
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formPage');
    console.log(this.formPage);
    console.log('this.pageDetail');
    console.log(this.pageDetail);
  }

  gen: any = { "app_component_id": 0, "_title": "Pagination", "_code": "Code", "_titleM1": "Title Modal", "ph_name": "Name", "ph_description": "Description", "at_name": "Name", "at_category": "Category", "at_template": "Template", "at_description": "Description", "btn_add": " Add", "btn_delete": "Delete", "btn_search": "Search", "btn_editWidget": "Edit Widget", "btn_clear": "Clear All", "btn_closeM1": "Close", "btn_edit": "Edit", "th_action": "Action", "th_no": "No", "th_name": "Name", "th_widget": "Widget", "th_description": "Description", "th_action2": "Action", "th_no2": "No", "th_name2": "Name", "th_description2": "Description", "th_template2": "Template", "td_select": "Select", "td_select2": "Select" };

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
    this.httpService.getTranslate('45').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;

          this.getTemplateList();
          this.getPageCategory();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  getTemplateList() {
    this.templateList = JSON.parse("[]");
    this.httpService.http_api_get('website/template/search/').subscribe((value) => {
      if (value.success) {
        this.templateList = value.data.template;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getPageCategory() {
    this.pageCategory = JSON.parse("[]");
    this.httpService.http_api_get('website/page/category/').subscribe((value) => {
      if (value.success) {
        this.pageCategory = value.data.category;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  getpagedetails(selectedTemplate) {
    this.httpService.http_api_post('website/page/detail', selectedTemplate)
      .subscribe((value) => {
        if (value.success) {
          this.pageDetails = value.data.page;
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  gettemplatedetails(selectedTemplate) {
    this.httpService.http_api_post('website/template/details', selectedTemplate)
      .subscribe((value) => {
        if (value.success) {
          this.templateDetails = value.data.template;
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  pageParse: any = {};

  submitFormPage() {

    this.pageParse = this.copying(this.formPage.getRawValue());

    this.pageParse.update_by = this.httpService.currentUser.employee_id;
    this.pageParse.update_datetime = new Date();

    if (this.formPage.value.page_id == '') {

      this.pageParse.create_by = this.httpService.currentUser.employee_id;
      this.pageParse.create_datetime = new Date();

      this.httpService.http_api_post('website/page', this.pageParse)
        .subscribe((value) => {

          if (value.success) {

            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.pageParse.page_id = value.data.lastId;
            this.pageParse.page_code = value.data.page_code;
            this.formPage.patchValue(this.copying(this.pageParse));

          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {
      this.updatePage();
    }
  }

  deletePage() {
    if (confirm("Are you sure to delete this data?")) {
      this.formPage.patchValue({ is_active: 0 });
      this.updatePage();
    }
  }

  updatePage() {
    this.httpService.http_api_put('website/page', this.pageParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formPage.value.is_active == 0) {
            this.clearAll();
          }
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  clearAll() {
    this.formPage.reset(this._formPage);
    this.pageDetail = this.copying(this.defaultPageDetail);
    this.pageDetails = this.copying(this.defaultPageDetails);
    this.templateDetails = this.copying(this.defaultTemplateDetails);
    this.widgetDetails = this.copying(this.defaultWidgetDetails);
  }

  selectWidget(item) {
    item.page_id = this.formPage.value.page_id;
    this.httpService.http_api_post('website/page/widgetdetails', this.copying(item))
      .subscribe((value) => {
        if (value.success) {
          this.widgetDetails = value.data.widget;
          for (const items of this.widgetDetails) {
            if (items.detail == null || items.detail == '') {
              items.detail = items.default;
            } else if (items.widget_detail_category_id == 'image') {
              items.image = this.httpService.baseAssetsDisc + 'widget/' + items.detail;
            }
          }
        }
      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  onUploadCompleted(data, index) {

    if (data['error'] == true) {
      this.notif.error = { title: 'Error', content: 'failed upload image', setting: this.httpService.error, change: Math.random().toString() };
    } else {
      if (this.widgetDetails[index].detail == '') {
        this.widgetDetails[index].oldimage = 'new';
      } else {
        this.widgetDetails[index].oldimage = this.widgetDetails[index].detail;
      }

      this.widgetDetails[index].detail = JSON.parse(data.response)[0].filename;
    }

  }

  EditWidgetDetails() {

    this.httpService.http_api_put('website/page/widgetdetails', { page_id: this.formPage.value.page_id, widgetDetails: this.widgetDetails })
      .subscribe((value) => {

        // if (value.success) {
        //   this.widgetDetails = value.data.widget;
        //   for (const items of this.widgetDetails) {
        //     if (items.detail == null) {
        //       items.detail = items.default;
        //     }
        //   }
        // }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });
  }

  modalShow() {
    this.ModalHeader = 'List Page';
    this.ModalGetpage();
    this.childModal.show();
  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut() {
    this.clearAll();
    this.formPage.patchValue(this.copying(this.ModalSelectedPage));
    // this.getpagedetails(activeModal.componentInstance.selectedPage);
    this.gettemplatedetails(this.ModalSelectedPage);
    this.modalHide();
  }

  ModalSelectPage(item) {
    this.ModalSelectedPage = item;
    this.modalOut();
  }

  public Modalpage: any = [];
  public ModalHeader: string;
  public ModalSelectedPage: string = '';

  ModalGetpage() {
    this.Modalpage = JSON.parse("[]");
    this.httpService.http_api_get('website/page/search/').subscribe((value) => {
      if (value.success) {
        this.Modalpage = value.data.page;
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
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
