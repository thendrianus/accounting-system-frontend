import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { FullLayoutComponent } from './full-layout.component';
import { EmptyLayoutComponent } from './empty-layout.component';

const routes: Routes = [
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: './../dashboard/dashboard.module#DashboardModule',
        data: {
          title: 'Dashboard'
        },
      },
      {
        path: 'employeeaccount',
        loadChildren: './../company/employeeAccount/employeeAccount.module#EmployeeAccountModule',
        data: {
          title: 'Employee'
        },
      },
      {
        path: 'website',
        loadChildren: './../website/website.module#WebsiteModule',
        data: {
          title: 'Website'
        },
      },
      {
        path: 'purchasing',
        loadChildren: './../purchasing/purchasing.module#PurchasingModule',
        data: {
          title: 'Purchasing'
        },
      },
      {
        path: 'purchase',
        loadChildren: './../purchasing/purchase/purchase.module#PurchaseModule',
        data: {
          title: 'purchase'
        },
      },
      {
        path: 'selling',
        loadChildren: './../selling/selling.module#SellingModule',
        data: {
          title: 'Selling'
        },
      },
      {
        path: 'sale',
        loadChildren: './../selling/sale/sale.module#SaleModule',
        data: {
          title: 'Sale'
        },
      },
      {
        path: 'retailselling',
        loadChildren: './../retailselling/retailselling.module#RetailsellingModule',
        data: {
          title: 'Retail Selling'
        },
      },
      {
        path: 'company',
        loadChildren: './../company/company.module#CompanyModule',
        data: {
          title: 'Company'
        },
      },
      {
        path: 'currencyandtax',
        loadChildren: './../company/currencyAndTax/currencyAndTax.module#CurrencyAndTaxModule',
        data: {
          title: 'Currency And Tax'
        },
      },
      {
        path: 'employee',
        loadChildren: './../company/employee/employee.module#EmployeeModule',
        data: {
          title: 'Employee'
        },
      },
      {
        path: 'businesspartner',
        loadChildren: './../company/businesspartner/businesspartner.module#BusinesspartnerModule',
        data: {
          title: 'Business Partner'
        },
      },

      {
        path: 'accounting',
        loadChildren: './../accounting/accounting.module#AccountingModule',
        data: {
          title: 'Accounting'
        },
      },
      {
        path: 'account',
        loadChildren: './../accounting/account/account.module#AccountModule',
        data: {
          title: 'Account'
        },
      },
      {
        path: 'journal',
        loadChildren: './../accounting/journal/journal.module#JournalModule',
        data: {
          title: 'Journal'
        },
      },
      {
        path: 'giro',
        loadChildren: './../accounting/giro/giro.module#GiroModule',
        data: {
          title: 'Giro'
        },
      },
      {
        path: 'reconciliation',
        loadChildren: './../accounting/reconciliation/reconciliation.module#ReconciliationModule',
        data: {
          title: 'Reconciliation'
        },
      },
      {
        path: 'fixasset',
        loadChildren: './../accounting/fixAsset/fixAsset.module#FixAssetModule',
        data: {
          title: 'Fix Asset'
        },
      },
      {
        path: 'bb',
        loadChildren: './../accounting/beginningBallance/beginningBallance.module#BeginningBallanceModule',
        data: {
          title: 'Beginning Ballance'
        },
      },
      {
        path: 'inventory',
        loadChildren: './../inventory/inventory.module#InventoryModule',
        data: {
          title: 'Inventory'
        },
      },
      {
        path: 'stock',
        loadChildren: './../inventory/stock/stock.module#StockModule',
        data: {
          title: 'Stock'
        },
      },
      {
        path: 'manufacture',
        loadChildren: './../manufacture/manufacture.module#ManufactureModule',
        data: {
          title: 'Manufacture'
        },
      },
      {
        path: 'manufacturedata',
        loadChildren: './../manufacture/manufactureData/manufactureData.module#ManufactureDataModule',
        data: {
          title: 'Manufacture Data'
        },
      },
      {
        path: 'apps',
        loadChildren: './../apps/apps.module#AppsModule',
        data: {
          title: 'Apps'
        },
      },
      {
        path: 'settings',
        loadChildren: './../settings/settings.module#SettingsModule',
        data: {
          title: 'Settings'
        },
      },
    ]
  },
  {
    path: 'pos',
    component: EmptyLayoutComponent,
    data: {
      title: 'pos'
    },
    children: [
      { path: 'retailselling', loadChildren: './../retailselling/retailselling.module#RetailsellingModule' },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
