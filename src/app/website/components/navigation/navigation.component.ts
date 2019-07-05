import { Component, ViewChild } from '@angular/core';
import { HttpService } from '../../../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'navigation',
  styleUrls: ['./navigation.scss'],
  templateUrl: './navigation.html'
})
export class Navigation {

  @ViewChild('childModal') public childModal: ModalDirective;

  public navigationdata: any = [];
  public navigationdatsa: any = 'aaaaaaaaa';
  closeResult: string;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formData = { name: '', url: 'javascript:void(0)', description: '-', navigation_category_id: '', navigation: [], positions: 0, language_id: 'Id', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }

  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formData = this.formBuilder.group({ //sssss
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      url: ['javascript:void(0)', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      navigation_category_id: '',
      navigation: [],
      positions: [0, [Validators.required, Validators.minLength(1), Validators.maxLength(2)]],
      language_id: 'Id',
      update_by: '-',
      create_by: '-',
      create_datetime: new Date(),
      update_datetime: new Date(),
      is_use: 1,
      is_active: 1
    });

  }

  refreshComponent() {
    this.ngOnInit();
    this.notif.success = { title: 'Success', content: 'Data Refreshed', setting: this.httpService.success, change: Math.random().toString() };
  }

  printConsoleForm() {
    console.log('this.formData');
    console.log(this.formData);
  }

  gen: any = { "app_component_id": 0, "_title": "Navigation", "_titleM1": "Title Modal", "ph_navigation": "Navigation", "ph_url": "Url", "ph_position": "Position", "ph_description": "Description", "at_navigation": "Navigation", "at_url": "Url", "at_position": "Position", "at_language": "Language", "at_description": "Description", "btn_add_navbar": "Add Navbar", "btn_closeM1": "Close", "btn_add": " Add", "btn_delete": "Delete", "td_add_child": "Add Child", "td_edit_child": "Edit Child" };

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
    this.httpService.getTranslate('44').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.loadNavigationData();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }

  loadNavigationData() {
    this.navigationdata = JSON.parse("[]");
    this.httpService.http_api_get('website/navigation/').subscribe((value) => {
      if (value.success) {
        for (const item1 of value.data.category) {
          if (item1.navigation == '[]') {
            item1.navigation = JSON.parse(item1.navigation);
          }
          for (const item of value.data.navigation) {
            if (item.navigation_category_id == item1.navigation_category_id) {
              item.navigation = JSON.parse(item.navigation);
              item1.navigation.push(item);
            }
          }
          this.navigationdata.push(item1);
        }
      }
    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        console.log(error);
      });
  }

  modalShow1(id) {
    this.ModalAction = true;

    this.ModalHeader = 'Add New Navbar';
    this.formData.reset(this._formData);
    this.formData.patchValue({ navigation_category_id: id });

    this.childModal.show();

  }

  modalShow(data, item, action, i) {
    this.ModalAction = false;

    this.ModalHeader = 'Edit Navbar';
    if (i == 0) {
      this.ModalshowLanguage = false;
    }

    if (action == 'edit') {
      this.formData.patchValue(item);
      this.ModalshowEditBtn = true;
    }

    this.childModal.show();

  }

  modalHide() {
    this.childModal.hide();
  }

  modalOut(ModalAction) {

    if (this.formData.value.create_by == '-') {
      this.formData.patchValue({
        create_by: this.httpService.currentUser.employee_id,
        create_datetime: new Date()
      })
    }

    this.formData.patchValue({
      create_by: this.httpService.currentUser.employee_id,
      create_datetime: new Date()
    })

    if (ModalAction) {
      //add parent
      this.httpService.http_api_post('website/navigation', this.formData.getRawValue())
        .subscribe((value) => {
          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.loadNavigationData();
          } else {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
            console.log(error);
          });
    } else {
      //add edit child
      if (this.ModalShowParam.action == 'add') {
        this.ModalShowParam.item.navigation.push(this.formData.value);
      }
      console.log(this.ModalShowParam)
      this.httpService.http_api_put('website/navigation', this.ModalShowParam.data)
        .subscribe((value) => {
          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.loadNavigationData();
          } else {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          }
        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
            console.log(error);
          });

    }
    this.modalHide();
  }

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  ModalHeader: string;

  ModalshowEditBtn: boolean = false;
  ModalshowLanguage: boolean = true;
  ModalAction: boolean = true;
  ModalShowParam = { data: {}, action: '', item: { navigation: [] } };

  formData: any;

  setLanguage(event) {
    this.formData.patchValue({ language_id: event });
  }

  deleteSubmitModal() {
    if (confirm("Are you sure to delete this data?")) {
      this.formData.patchValue({ is_active: 0 });
      this.modalOut(this.ModalAction);
    }
  }

  submitModal() {
    this.modalOut(this.ModalAction);
    // this.activeModal.close();
  }

}
