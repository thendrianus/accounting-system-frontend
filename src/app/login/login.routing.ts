import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModuleWithProviders } from '@angular/core';
import { Login } from './login.component';


const routes: Routes = [
  {
    path: '',
    component: Login
  },
  {
    path: ':id',
    component: Login
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class routing { } 
