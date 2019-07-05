import { Component } from '@angular/core';
import { HttpService } from '../../../';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'project',
  styleUrls: ['./project.scss'],
  templateUrl: './project.html',
})
export class Project {

  formProject;
  currentUser: any = { employee_job_id: 0 };

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  disableInput: any = {}

  _formProject = { project_id: '', project_code: '', project: '', description: '-', update_by: '-', create_by: '-', create_datetime: new Date(), update_datetime: new Date(), is_use: 1, is_active: 1 }
  printConsole = localStorage.getItem('printConsoleDebug') == 'true' ? true : false;
  constructor(
    protected httpService: HttpService,
    public formBuilder: FormBuilder,
  ) {

    this.formProject = this.formBuilder.group({ //sssss
      project_id: '',
      project_code: ['', [Validators.minLength(0), Validators.maxLength(20)]],
      project: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      description: ['-', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]],
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
    console.log('this.formProject');
    console.log(this.formProject);
  }

  paramId: any = '';
  private subParam: any;

  gen: any = { "app_component_id": 0, "_title": "Project", "_code": "Project Code", "ph_code": "Project Code", "ph_project": "Project", "ph_description": "Description", "at_code": "Project Code", "at_project": "Project", "at_description": "Description", "btn_add": " Add", "btn_edit": "Edit", "btn_delete": "Delete", "btn_clear": "Clear All", "th_action": "Action", "th_code": "Code", "th_project": "Project", "th_description": "Description", "td_edit": "Edit" };

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
    this.httpService.getTranslate('33').subscribe(
      value => {
        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          //this.httpService.authorization(true);
          this.currentUser = this.httpService.currentUser;
          this.disableInput.project_code = true;
          this.getProject();
        } else {
          this.httpService.goToDashboard();
        }
      }
    )
  }
  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  projectData: any = [];
  getProject() {
    this.httpService.http_api_post('transaction/project/select', { is_use: 0 }).subscribe((value) => {

      if (value.success) {
        this.projectData = value.data.project;
      }

    },
      error => {
        this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
      });
  }

  projectParse: any;
  projectSubmit() {

    this.projectParse = this.copying(this.formProject.getRawValue());
    this.projectParse.update_by = this.httpService.currentUser.employee_id;
    this.projectParse.update_datetime = new Date();

    if (this.projectParse.project_id == '') {
      this.projectParse.create_by = this.httpService.currentUser.employee_id;
      this.projectParse.create_datetime = new Date();

      this.httpService.http_api_post('transaction/project', this.projectParse)
        .subscribe((value) => {

          if (value.success) {
            this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
            this.formProject.patchValue({
              ...this.copying(this.projectParse),
              project_id: value.data.project_id,
              project_code: value.data.project_code
            })

            this.getProject();
          } else {
            this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
          }

        },
          error => {
            this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
          });
    } else {

      this.saveUpdate();
    }

  }

  saveUpdate() {

    this.httpService.http_api_put('transaction/project', this.projectParse)
      .subscribe((value) => {

        if (value.success) {
          this.notif.success = { title: 'Success', content: value.label, setting: this.httpService.success, change: Math.random().toString() };
          if (this.formProject.value.is_active == 0) {
            this.clearAll();
          } else {
            this.formProject.patchValue({ ...this.copying(this.projectParse) });
          }
          this.getProject();
        } else {
          this.notif.error = { title: 'Error', content: value.label, setting: this.httpService.error, change: Math.random().toString() };
        }

      },
        error => {
          this.notif.error = { title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString() };
        });

  }

  projectDelete() {
    if (confirm("Are you sure to delete this data?")) {
      this.formProject.patchValue({ is_active: 0 });
      this.projectSubmit();
    }
  }

  clearAll() {
    this.formProject.reset(this._formProject);
  }

  editProject(item) {
    this.formProject.patchValue({ ...this.copying(item) });
  }

  isUseChange(table, is_use, id, id_name) {

    this.httpService.http_api_post('apps/isusechange', { table: table, is_use: is_use ? 0 : 1, id: id, id_name: id_name })
      .subscribe((value) => {
        if (value.success) {
          this.getProject();
          this.notif.success = { title: 'Success', content: '', setting: this.httpService.success, change: Math.random().toString() };
        } else {
          this.notif.error = { title: 'Error', content: 'Error in change data', setting: this.httpService.error, change: Math.random().toString() };
        }
      });

  }

}
