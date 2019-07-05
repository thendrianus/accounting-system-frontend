import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService, QzTrayService } from '../';

@Component({
  selector: 'app-dashboard',
  templateUrl: './full-layout.component.html'
})
export class FullLayoutComponent implements OnInit {

  public disabled = false;
  public status: { isopen: boolean } = { isopen: false };

  constructor(
    private router: Router,
    protected httpService: HttpService,
    protected qzTrayService: QzTrayService
  ) {

  }

  public toggled(open: boolean): void {

  }

  setLang(lang) {
    localStorage.setItem('language', lang);
    this.httpService.setLang({ lang: lang, group: this.httpService.currentUser.employee_account_id, currentCompany: localStorage.getItem('currentCompany') });
    this.ngOnInit();
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }

  tslogo: any = {};

  tslogofilename: string = "system";
  tslogotitle: string = "| Business System";

  gen: any = { "app_component_id": 0, "_master_data": "Master Data", "_ledger": "Ledger", "_selling": "Selling", "_purchase": "Purchase", "_cashbank": "Cash & Bank", "_report": "Report", "_website": "Website", "_manufacture": "Manufacture", "_stock": "Beginning Account", "_cash_in": "Cash In", "_cash_out": "Cash Out", "_cash_transfer": "Cash Transfer", "_reconciliation_bank": "Reconciliation Bank", "_reconciliation_adjustment": "Reconciliation Adjustment", "_giro_in": "Giro In", "_giro_out": "Giro Out", "_fix_asset_group": "Fix Asset Group", "_fix_asset": "Fix Asset", "th_dashboard": "Dashboard", "th_website": "Website", "th_inventory": "Inventory", "th_humanresource": "Human Resource", "th_accounting": "Accounting", "th_purchasing": "Purchasing", "th_selling": "Selling", "th_retails": "Retails", "th_project": "Project", "th_company": "Company", "th_manufature": "Manufacture", "th_apps": "Apps", "td_navigation": "Navigation", "td_template": "Template", "td_pagination": "Pagination", "td_widgets": "Widgets", "td_articles": "Articles", "td_fixasset": "Fix Asset", "td_stockchange": "Stock Change", "td_inventoryin": "Inventory In", "td_invenotryout": "Inventory Out", "td_stockadjustment": "Stock Adjustment", "td_warehouse": "Warehouse Stock Exchange", "td_employee": "Employee", "td_businesspartner": "Business Partner", "td_accountlist": "Account List", "td_accountlink": "Account Link", "td_generaljournal": "General Journal", "td_generalledger": "General Ledger", "td_beginningaccount": "Beginning Account", "td_beginning_cash": "Beginning Cash", "td_beginningpayable": "Beginning Payable", "td_beginningreceivable": "Beginning Receivable", "td_berginninginventory": "Beginning Inventory", "td_purchase": "Purchase", "td_purchaseorder": "Purchase Order", "td_purchasequotation": "Purchase Quotation", "td_purchasereturn": "Purchase Return", "td_purchaserequest": "Purchase Request", "td_purchasereceive": "Purchase Receive", "td_saleorder": "Sale Order", "td_salequotation": "Sale Quotation", "td_salereturn": "Sale Return", "td_sale_delivery_order": "Sale Delivery Order", "td_sale_delivery": "Sale Delivery", "td_pos": "POS", "td_pos_stand": "POS Stand", "td_company_list": "Company List", "td_company_data": "Company Data", "td_tax": "Tax", "td_warehouse2": "Warehouse", "td_branch": "Branch", "td_currency": "Currency", "td_salesman": "Salesman", "td_purchaseman": "Purchaseman", "td_employeeaccount": "Employee Account", "td_uom": "UOM", "td_department": "Department", "td_conversion_cost": "Conversion Cost", "td_standart_cost": "Standard Cost", "td_standart_inventory": "Standard Inventory", "td_bill_or_material": "Bill Of Material", "td_work_order": "Work Order", "td_material_release": "Material Release", "td_product_release": "Product Release", "td_component_generate": "Component Generate", "td_inventory": "Inventory", "td_sale": "Sale" };
  profile_picture = "assets/img/avatars/6.jpg";
  username = 'No User';

  ngOnInit(): void {

    if (this.httpService.is_authorization) {

      this.getGen();

    } else {

      this.httpService.authorization(true).then(value => {

        this.getGen();

      });

    }

  }

  genNav: any = { Side0: [], Side1: [], Side2: [], Top: [] };

  getGen() {

    if(!localStorage.getItem('currentUser')){
      window.location.href = "/login";
      return
    }
    this.httpService.getTranslate('50').subscribe(
      value => {

        if (value.hasOwnProperty("app_component_id")) {
          this.gen = value;
        } else {
          // this.httpService.goToDashboard();
        }

      }
    )

    this.httpService.getTranslate('app_nav').subscribe(
      value => {

        this.genNav = value;

      }
    )

    if (localStorage.getItem('profile_picture')) {
      if (localStorage.getItem('profile_picture').indexOf('.png') !== -1 || localStorage.getItem('profile_picture').indexOf('.jpg') !== -1) {
        this.profile_picture = localStorage.getItem('profile_picture');
      }
    }
    if (localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
    }

    this.setLogo(this.tslogofilename);

  }

  setLogo(logo) {

    if (this.tslogofilename.length > 6) {
      this.tslogo = { 'background-image': 'url(' + this.httpService.baseAssetsDisc + 'apps/logo/tslogo' + logo + '.png)', 'background-size': '130px auto' };
    } else if (this.tslogofilename.length < 4) {
      this.tslogo = { 'background-image': 'url(' + this.httpService.baseAssetsDisc + 'apps/logo/tslogo' + logo + '.png)', 'background-size': '85px auto' };
    } else {
      this.tslogo = { 'background-image': 'url(' + this.httpService.baseAssetsDisc + 'apps/logo/tslogo' + logo + '.png)', 'background-size': '110px auto' };
    }

  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentCompany');
    localStorage.removeItem('username');
    localStorage.removeItem('profile_picture');
    // this.router.navigateByUrl('/login');
    window.location.href = "/login";
    // window.location.reload();
  }

}
;