import { Component, Output, Input, EventEmitter } from '@angular/core';
import { HttpService } from '../../../';
@Component({
  selector: 'employeeselect',
  styleUrls: ['./employeeselect.scss'],
  templateUrl: './employeeselect.html'
})
export class Employeeselect {
  @Output() setEmployeeselect: EventEmitter<string> = new EventEmitter<string>();
  @Input() employeeJob: string;
  employeeselect: any = [];
  selectedEmployeeselect: string = '';

  constructor(
    protected httpService: HttpService,
  ) {

  }

  ngOnInit() {

    window.scrollTo(0, 0);

    this.httpService.http_api_post('apps/employeebyjob', { employee_job_id: this.employeeJob })
      .subscribe((value) => {
        if (value.success) {
          this.employeeselect = value.data.employeeselect;
          if (this.employeeselect.length > 0) {
            this.selectedEmployeeselect = this.employeeselect[0].employee_id;
            this.employeeselectChange();
          }
        }
      },
        error => {
          // this.notif.error = {title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};

        });
  }

  employeeselectChange() {
    this.setEmployeeselect.emit(this.selectedEmployeeselect);
  }
}
