import { Component, Input } from '@angular/core';
import { HttpService, QzTrayService } from '../../../';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'ts-bydatetime',
  styleUrls: ['./tsByDatetime.scss'],
  templateUrl: './tsByDatetime.html'
})
export class TsByDatetime {

  @Input() data = { 
    update_by: '-', 
    create_by: '-', 
    create_datetime: new Date(), 
    update_datetime: new Date(), 
    is_use: 1, 
    is_active: 1
  };

  @Input() report_id = 0;

  @Input() showCreateUpdate = "";

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  employee: any = [];

  create_by = "-";
  update_by = "-";
  printerList: any = [];

  ngOnChanges(changes: any) {

    if (changes.data) {
      this.setEmployee();
    }

    if (changes.report_id) {
      this.setReportTemplate()
    }

  }
  
  formPrinter

  constructor(
    protected httpService: HttpService,
    protected qzTrayService: QzTrayService,
    public formBuilder: FormBuilder
  ) {

    this.formPrinter = this.formBuilder.group({
      selectedPrinter: [''],
    });

    this.httpService.http_api_get('hrd/employee/listAll/')
      .subscribe(
        value => {
          if (value.success) {
            this.employee = value.data.employee;
            if (this.employee.length > 0) {
              this.setEmployee();
            }
          }
        },
        error => { }
      );

      try {
        let printers = JSON.parse(localStorage.getItem("listPrinters"))
        if(printers){
          this.printerList = printers.reverse();
          this.printerList.push("PDF")
          let defaultPrinter = localStorage.getItem("defaultPrinter")
          if(defaultPrinter){
            this.formPrinter.patchValue({
              selectedPrinter: defaultPrinter
            })
          }else if(printers[0]){
            this.formPrinter.patchValue({
              selectedPrinter: printers[0]
            })
          }
        }
      } catch (error) {
        console.log(error)
      }

  }

  ngOnInit(): void { }

  reportTemplate: any = [];
  selectedReportTemplate: any = "";

  setReportTemplate() {

    this.httpService.http_api_post('apps/report_template', { report_id: this.report_id })
      .subscribe(  
        value => {
          if (value.success) {
            this.reportTemplate = value.data.report_template;
            if (this.reportTemplate.length > 0) {
              this.selectedReportTemplate = this.reportTemplate[0].report_template;
            }
          } else { }
        },
        error => {
          console.log(error);
        }
      );

  }

  setEmployee() {

    this.create_by = "-";
    this.update_by = "-";

    for (var key in this.employee) {

      if (this.data.create_by == this.employee[key].employee_id) {
        this.create_by = this.employee[key].label;
      }

      if (this.data.update_by == this.employee[key].employee_id) {
        this.update_by = this.employee[key].label;
      }

    }

  }

  printerChange(event){
    this.formPrinter.patchValue({
      selectedPrinter: event
    })
  }

  generateReport(report_template) {

    if(this.reportTemplate.length > 0){
      let print = {
        report_data: {
          template: report_template ? report_template : this.selectedReportTemplate,
          data: this.data,
          report_id: this.report_id
        }
      }
      
      this.httpService.http_api_post("report", print).subscribe(
        value => {
          if(this.formPrinter.value.selectedPrinter == 'PDF'){
            window.open(`${this.httpService.serverUrl}reports/${value.data}`, "_blank");
          }else{
            console.log(value)
            var printData = [{
              type: 'pdf',
              data: `${this.httpService.serverUrl}reports/${value.data}`
            }];
            this.qzTrayService.printData(this.formPrinter.value.selectedPrinter, printData).subscribe(
              data => {
                console.log(data)
                this.notif.success = { title: 'Success', content: 'Data sent to printer', setting: this.httpService.success, change: Math.random().toString() };
              }
            )
          }
        },
        error => {
          console.log(error);
        }
      );
    }

  }
}
