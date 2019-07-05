import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
// import { Login } from './login/login.component';


const routes: Routes = [
  // {
  //   path: '',
  //   component: Login
  // },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
