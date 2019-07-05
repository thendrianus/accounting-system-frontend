import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HttpModule } from '@angular/http';
import { routing } from './login.routing';
import { Login } from './login.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { LoginHttpService } from './../';

const COMPONENTS = [
  Login,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    HttpModule,
    routing,
    SimpleNotificationsModule.forRoot(),
  ],
  declarations: [
    ...COMPONENTS
  ],
  exports: [
    ...COMPONENTS
  ], entryComponents: [
  ],
  providers: [
    LoginHttpService
  ],

})
export class LoginModule {
  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: LoginModule,
      providers: [
        // ...SERVICES
      ],
    };
  }
}
