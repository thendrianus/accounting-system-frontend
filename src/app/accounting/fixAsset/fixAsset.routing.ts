import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Fix_asset_group } from './components/fix_asset_group';
import { Fix_asset } from './components/fix_asset';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  { path: 'fixassetgroup', component: Fix_asset_group, data: { title: 'Fix Asset Group' } },
  { path: 'fixasset', component: Fix_asset, data: { title: 'Fix Asset' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class routing { }



