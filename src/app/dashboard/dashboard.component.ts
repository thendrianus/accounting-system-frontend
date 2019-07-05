import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpService, QzTrayService } from '../';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Validators, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import jsPDF from 'jspdf'
import { map } from 'rxjs-compat/operator/map';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('childModal') public childModal: ModalDirective;
  currentUser: any = { employee_job_id: 0 };
  formReport: any;
  reportList: any = [];

  notif: any = { success: {}, alert: {}, error: {}, info: {}, warn: {} };

  _formReport = { datefrom: moment().format("YYYY-MM-DD"), dateto: moment().format("YYYY-MM-DD"), report_template_id: '', name: '' }

  printerList: any = [];

  formPrinter
  
  constructor(
    protected httpService: HttpService,
    public qzTrayService: QzTrayService,
    private route: ActivatedRoute,
    public formBuilder: FormBuilder,
  ) {

    this.formPrinter = this.formBuilder.group({
      selectedPrinter: [''],
    });

    this.formReport = this.formBuilder.group({
      datefrom: moment().format("YYYY-MM-DD"),
      dateto: moment().format("YYYY-MM-DD"),
      report_template_id: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
      name: '',
      report_template: '',
      report_id: ''
    });

    try {
      let printers = JSON.parse(localStorage.getItem("listPrinters"))
      if(printers){
        this.printerList = printers.reverse();
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

  showTemplate: boolean = false;

  gen: any = { "app_component_id": 0, "_master_em_title": "Employee", "_master_em_subtitle": "Company Employee", "_master_pa_title": "Partner", "_master_pa_subtitle": "Business Partner", "_master_tax_title": "Tax", "_master_tax_subtitle": "Transaction Tax", "_master_in_title": "Inventory", "_master_in_subtitle": "Inventory", "_ledger_gj_title": "General Journal", "_ledger_gj_subtitle": "General Journal", "_ledger_gl_title": "General Ledger", "_ledger_gl_subtitle": "General Ledger", "_ledger_ac_title": "Account", "_ledger_ac_subtitle": "Journal Account", "_selling_s_title": "Selling", "_selling_s_subtitle": "Selling", "_selling_so_title": "Selling Order", "_selling_so_subtitle": "Selling Order", "_selling_qu_title": "Quotation", "_selling_qu_subtitle": "Selling Quotation", "_purchase_p_title": "Purchase", "_purchase_p_subtitle": "Purchase", "_purchase_po_title": "PO", "_purchase_po_subtitle": "Purchase Order", "_purchase_qu_title": "Quotation", "_purchase_qu_subtitle": "Purchase Quotation", "_cashbank_ci_title": "Cash In", "_cashbank_ci_subtitle": "Cash In", "_cashbank_co_title": "Cash Out", "_cashbank_co_subtitle": "Cash Out", "_cashbank_ct_title": "Cash Transfer", "_cashbank_ct_subtitle": "Cash Transfer", "_cashbank_rb_title": "Reconciliation Bank", "_cashbank_rb_subtitle": "Reconciliation Bank", "_website_na_title": "Navigation", "_website_na_subtitle": "Navigation", "_website_te_title": "Template", "_website_te_subtitle": "Template", "_website_pa_title": "Pagination", "_website_pa_subtitle": "Pagination", "_website_wi_title": "widgets", "_website_wi_subtitle": "Widget", "_website_ar_title": "Articles", "_website_ar_subtitle": "Article", "_manufacture_cc_title": "Conversion Cost", "_manufacture_cc_subtitle": "Conversion Cost", "_manufacture_sc_title": "Standard Cost", "_manufacture_sc_subtitle": "Standard Cost", "_manufacture_si_title": "Standard Inventory", "_manufacture_si_subtitle": "Standard Inventory", "_manufacture_bom_title": "Bill Of Material", "_manufacture_bom_subtitle": "Bill Of Material", "_manufacture_wo_title": "Work Order", "_manufacture_wo_subtitle": "Work Order", "_manufacture_mr_title": "Material Release", "_manufacture_mr_subtitle": "Material Release", "_manufacture_pr_title": "Product Result", "_manufacture_pr_subtitle": "Product Result", "_beginning_account_title": "Beginning Account", "_beginning_account_subtitle": "Beginning Account", "_beginning_cash_title": "Beginning Cash", "_beginning_cash_subtitle": "Beginning Cash", "_beginning_payable_title": "Beginning Payable", "_beginning_payable_subtitle": "Beginning Payable", "_beginning_receivable_title": "Beginning Receivable", "_beginning_receivable_subtitle": "Beginning Receivable", "_beginning_inventory_title": "Beginning Inventory", "_beginning_enventory_subtitle": "Beginning Inventory", "_pos_stand_title": "POS Stand", "_pos_stand_subtitle": "POS Stand", "_project_title": "Project", "_project_subtitle": "Project", "_fix_asset_group_title": "Fix Asset Group", "_fix_asset_group_subtitle": "Fix Asset Group", "_fix_asset_title": "Fix Asset", "_fix_asset_subtitle": "Fix Asset", "_company_list_title": "Company List", "_company_list_subtitle": "Company List", "_company_data_title": "Company Data", "_company_data_subtitle": "Company Data", "_tax_title": "Tax", "_tax_subtitle": "Tax", "_warehouse_title": "Warehouse", "_warehouse_subtitle": "Warehouse", "_branch_title": "Branch", "_branch_subtitle": "Branch", "_currency_title": "Currency", "_currency_subtitle": "Currency", "_salesman_title": "Salesman", "_salesman_subtitle": "Salesman", "_purchaseman_title": "Purchaseman", "_purchaseman_subtitle": "Purchaseman", "_employee_account_title": "Employee Account", "_employee_account_subtitle": "Employee Account", "_uom_title": "UOM", "_uom_subtitle": "Unit Of Measurement", "_department_title": "Department", "_department_subtitle": "Department", "_account_link_title": "Account Link", "_account_link_subtitle": "Account Link", "_pos_title": "POS", "_point_of_sale_subtitle": "Point Of Sale", "_sale_return_title": "Sale Return", "_sale_return_subtitle": "Sale Return", "_delivery_order_title": "Delivery Order", "_delivery_order_subtitle": "Delivery Order", "_sale_delivery_title": "Sale Delivery", "_sale_delivery_subtitle": "Sale Delivery", "_purchase_return_title": "Purchase Return", "_purchase_return_subtitle": "Purchase Return", "_purchase_request_title": "Purchase Request", "_purchase_request_subtitle": "Purchase Request", "_purchase_receive_title": "Purchase Receive", "_purchase_receive_subtitle": "Purchase Receive", "_reconciliation_adjustment_title": "Reconciliation Adjustment", "_reconciliation_adjustment_subtitle": "Reconciliation Adjustment", "_giro_in_title": "Giro In", "_giro_in_subtitle": "Giro In", "_giro_out_title": "Giro Out", "_giro_out_subtitle": "Giro Out", "_stock_change_title": "Stock Change", "_stock_change_subtitle": "Stock Change", "_inventory_in_title": "Inventory In", "_inventory_in_subtitle": "Inventory In", "_inventory_out_title": "Inventory Out", "_inventory_out_subtitle": "Inventory Out", "_stock_adjustment_title": "Stock Adjustment", "_stock_adjustment_subtitle": "Stock Adjustment", "_warehouse_stock_exchange_title": "Warehouse Stock Exchange", "_warehouse_stock_exchange_subtitle": "Warehouse Stock Exchange", "_master_data_title": "Master Data", "_master_data_subtitle": "Master Data", "_ledger_title": "Ledger", "_ledger_subtitle": "Ledger", "_purchase_title": "Purchase", "_purchase_subtitle": "Purchase", "_selling_title": "Selling", "_selling_subtitle": "Selling", "_cashbank_title": "Cash & Bank", "_cashbank_subtitle": "Cash and Bank", "_stock_title": "Stock", "_stock_subtitle": "Stock", "_website_title": "Website", "_website_subtitle": "Website", "_manufacture_title": "Manufacture", "_manufacture_subtitle": "Manufacture", "_report_title": "Report", "_report_subtitle": "Report", "_viewmore": "View More", "_employeejob_subtitle": "Employee Job", "_employeejob_title": "Employee Job" };

  paramId: any = '';
  private subParam: any;
  dashboardCard: boolean = true;
  reportDetailCard: boolean = false;
  cardData: any = [];
  cardDataReport: any = [];

  financialReportDatas = [];
  ledgerReportDatas = [];
  cashbankReportDatas = [];
  saleReportDatas = [];
  receivableReportDatas = [];
  purchaseReportDatas = [];
  payableReportDatas = [];
  productReportDatas = [];
  productionReportDatas = [];
  othersReportDatas = [];

  reportCardData() { //REPORT CATEGORY
    return [
      { app_nav_detail_title: 'Financial Statement', app_nav_detail_subtitle: 'Company Employee', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/financialstatement', color_class: 'sun-flower' },
      { app_nav_detail_title: 'Ledger', app_nav_detail_subtitle: 'Business Partner', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/ledger', color_class: 'carrot' },
      { app_nav_detail_title: 'Cash & Bank', app_nav_detail_subtitle: 'Transaction Tax', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/cashbank', color_class: 'alizarin' },
      { app_nav_detail_title: 'Sale', app_nav_detail_subtitle: 'Sale', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/sale', color_class: 'clouds' },
      { app_nav_detail_title: 'Receiveable', app_nav_detail_subtitle: 'Receiveable', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/receiveable', color_class: 'concrete' },
      { app_nav_detail_title: 'Purchase', app_nav_detail_subtitle: 'Purchase', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/purchase', color_class: 'turquoise' },
      { app_nav_detail_title: 'Payable', app_nav_detail_subtitle: 'Payable', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/payable', color_class: 'emerald' },
      { app_nav_detail_title: 'Product', app_nav_detail_subtitle: 'Product', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/product', color_class: 'peter-river' },
      { app_nav_detail_title: 'Production', app_nav_detail_subtitle: 'Production', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/product', color_class: 'wet-asphalt' },
      { app_nav_detail_title: 'Others', app_nav_detail_subtitle: 'Others', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report/others', color_class: 'emethyst' },
      { app_nav_detail_title: 'Report Template', app_nav_detail_subtitle: 'Report Template', icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/company/reporttemplate', color_class: 'emethyst' }
    ]
  }

  generateReportData(report_category_id) {
    return this.reportList.filter(e => {
      return e.report_category_id === report_category_id
    })
  }

  

  copying(data) {
    return JSON.parse(JSON.stringify(data));
  }

  ngOnInit(): void {

    this.httpService.authorization(true);

    if (this.httpService.is_authorization) {

      this.getGen();
      this.loadReportList(false)
      
    } else {

      this.httpService.authorization(true).then(value => {

        this.getGen();
        this.loadReportList(false)

      });

    }

  }

  genNav: any = { Side0: [], Side1: [], Side2: [], Top: [] };

  processReportOnClick(params) {
    if (params['id2'] == 'financialstatement') {
      this.generateCardData(this.generateReportData(2));
    } else if (params['id2'] == 'ledger') {
      this.generateCardData(this.generateReportData(3));
    } else if (params['id2'] == 'cashbank') {
      this.generateCardData(this.generateReportData(4));
    } else if (params['id2'] == 'sale') {
      this.generateCardData(this.generateReportData(5));
    } else if (params['id2'] == 'receiveable') {
      this.generateCardData(this.generateReportData(6));
    } else if (params['id2'] == 'purchase') {
      this.generateCardData(this.generateReportData(7));
    } else if (params['id2'] == 'payable') {
      this.generateCardData(this.generateReportData(11));
    } else if (params['id2'] == 'product') {
      this.generateCardData(this.generateReportData(8));
    } else if (params['id2'] == 'production') {
      this.generateCardData(this.generateReportData(9));
    } else if (params['id2'] == 'others') {
      this.generateCardData(this.generateReportData(10));
    }
    this.reportDetailCard = false;
  }

  loadReportList(params){
    this.httpService.http_api_get('apps/report_template/report')
    .subscribe(
      value => {
        console.log(value)
        if (value.success) {
          this.reportList = value.data.report;
          if(params){
            this.processReportOnClick(params)
          }else{
            this.financialReportDatas = this.generateReportData(2);
            this.ledgerReportDatas = this.generateReportData(3);
            this.cashbankReportDatas = this.generateReportData(4);
            this.saleReportDatas = this.generateReportData(5);
            this.receivableReportDatas = this.generateReportData(6);
            this.purchaseReportDatas = this.generateReportData(7);
            this.payableReportDatas = this.generateReportData(11);
            this.productReportDatas = this.generateReportData(8);
            this.productionReportDatas = this.generateReportData(9);
            this.othersReportDatas = this.generateReportData(10);
          }
        } else {

        }
      },
      error => {
        //  this.notif.error = {app_nav_detail_title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
        console.log(error);
      }
    );
  }

  getGen() {
    this.httpService.getTranslate('3').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
          this.currentUser = this.httpService.currentUser;
        } else {
          this.httpService.goToDashboard();
        }
      }
    )

    this.httpService.getTranslate('app_nav').subscribe(
      value => {
        console.log(value)
        this.genNav = value;

        this.subParam = this.route.params.subscribe(params => {
          if (params['id']) {
            this.paramId = params['id'];
            this.reportDetailCard = true;
            if (this.paramId == "masterdata") {
              this.generateCardData(this.getNavdata(value.Top, 1));
            } else if (this.paramId == "ledger") {
              this.generateCardData(this.getNavdata(value.Top, 2));
            } else if (this.paramId == "selling") {
              this.generateCardData(this.getNavdata(value.Top, 4));
            } else if (this.paramId == "purchase") {
              this.generateCardData(this.getNavdata(value.Top, 3));
            } else if (this.paramId == "cashbank") {
              this.generateCardData(this.getNavdata(value.Top, 5));
            } else if (this.paramId == "report") {
              if (params['id2']) {
                if (this.reportList.length < 1) {
                  this.loadReportList(params);
                } else {
                  this.processReportOnClick(params)
                }
              } else {
                this.reportDetailCard = true;
                this.generateCardData(this.reportCardData());
              }
            } else if (this.paramId == "website") {
              this.generateCardData(this.getNavdata(value.Top, 7));
            } else if (this.paramId == "manufacture") {
              this.generateCardData(this.getNavdata(value.Top, 8));
            } else if (this.paramId == "stock") {
              this.generateCardData(this.getNavdata(value.Top, 6));
            } else {
              this.cardData = JSON.parse("[]");
              this.dashboardCard = true;
            }

          }
        });

      }
    )
  }

  getNavdata(data, id) {
    for (let item of data) {
      if (item.item.app_nav_id == id) {
        return item.data;
      }
    }
  }

  generateCardData(cardDatas) {
    if (cardDatas.length > 0) {
      this.cardData = [{ rows: [] }]; // length 1
    }

    for (var key in cardDatas) {
      var cardDataLength = this.cardData.length - 1; // length 1

      var innerCardDataLength = this.cardData[cardDataLength].rows.length;

      // this.cardData[cardDataLength].rows[innerCardDataLength] = cardDatas[key];

      if (innerCardDataLength < 4) {
        this.cardData[cardDataLength].rows[innerCardDataLength] = cardDatas[key];
      } else {
        this.cardData[cardDataLength + 1] = { rows: [] };
        this.cardData[cardDataLength + 1].rows[0] = cardDatas[key];
      }
    }
    this.dashboardCard = false;

  }

  tsNavbar: any = [{
    rows: [
      { app_nav_detail_title: this.gen._master_data_title, app_nav_detail_subtitle: this.gen._master_data_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/masterdata', color_class: 'turquoise' },
      { app_nav_detail_title: this.gen._ledger_title, app_nav_detail_subtitle: this.gen._ledger_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/ledger', color_class: 'emerald' },
      { app_nav_detail_title: this.gen._purchase_title, app_nav_detail_subtitle: this.gen._purchase_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/purchase', color_class: 'peter-river' },
      { app_nav_detail_title: this.gen._selling_title, app_nav_detail_subtitle: this.gen._selling_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/selling', color_class: 'emethyst' },
    ]
  }, {
    rows: [
      { app_nav_detail_title: this.gen._cashbank_title, app_nav_detail_subtitle: this.gen._cashbank_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/cashbank', color_class: 'wet-asphalt' },
      { app_nav_detail_title: this.gen._stock_title, app_nav_detail_subtitle: this.gen._stock_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/stock', color_class: 'sun-flower' },
      { app_nav_detail_title: this.gen._website_title, app_nav_detail_subtitle: this.gen._website_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/website', color_class: 'carrot' },
      { app_nav_detail_title: this.gen._manufacture_title, app_nav_detail_subtitle: this.gen._manufacture_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/manufacture', color_class: 'alizarin' },
    ]
  }, {
    rows: [
      { app_nav_detail_title: this.gen._report_title, app_nav_detail_subtitle: this.gen._report_subtitle, icon_class: 'fa fa-newspaper-o', app_nav_detail_url: '/ts/dashboard/report', color_class: 'clouds' }
    ]
  }];

  reportSetting: any = { datefrom: moment().format("YYYY-MM-DD"), dateto: moment().format("YYYY-MM-DD"), report_template_id: '' };
  reportSettingShow: any = {};
  reportTemplate: any = [];
  selectedReportTemplate = '';

  childModalShow(item) {
    
    item.datefrom = moment(item.datefrom).format("YYYY-MM-DD")
    item.dateto = moment(item.dateto).format("YYYY-MM-DD")

    this.httpService.http_api_post('apps/report_template', { report_id: item.report_id })
      .subscribe(
        value => {
          if (value.success) {
            this.reportTemplate = value.data.report_template;
            if (this.reportTemplate.length > 0) {
              this.reportSetting.report_template_id = this.reportTemplate[0].value;
              this.reportTemplateChange(this.reportTemplate[0]);
            }
          } else {

          }
        },
        error => {
          //  this.notif.error = {app_nav_detail_title: 'Network Issue', content: 'Cannot connect to server', setting: this.httpService.error, change: Math.random().toString()};
          console.log(error);
        }
      );

    this.childModal.show();
    this.reportSettingShow = item;

  }

  printerChange(event){
    this.formPrinter.patchValue({
      selectedPrinter: event
    })
  }

  generateReport() { 
    //sini
    this.reportSetting = { ...this.reportSetting, ...this.formReport.value }
    console.log(this.reportSetting)
    let print = {
      report_data: {
        template: this.reportSetting.report_template,
        data: this.reportSetting,
        report_id: this.reportSetting.report_id
      }
    }

    this.httpService.http_api_post("report", print).subscribe(
      value => {
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
      },
      error => {
        console.log(error);
      }
    );

  }

  reportTemplateChange(event) {

    this.formReport.patchValue({
      name: event.name,
      report_template_id: event.report_template_id,
      report_template: event.report_template,
      report_id: event.report_id
    })
    console.log(this.formReport)

  }

}
