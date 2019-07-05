import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
// import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: SimpleLayoutComponent,
    data: {
      title: 'Login'
    },
    children: [
      {
        path: '',
        loadChildren: './login/login.module#LoginModule',
      }
    ]
  },
  {
    path: 'ts',
    loadChildren: './layouts/layouts.module#LayoutsModule',
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
