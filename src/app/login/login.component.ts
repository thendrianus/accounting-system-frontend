import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { LoginHttpService } from '../';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  public form: FormGroup;
  public email: AbstractControl;
  public account_password: AbstractControl;
  public submitted: boolean = false;
  public loginHidden: boolean = true;

  formRegister;

  server;

  isThereAdmin: any = 1;

  constructor(
    fb: FormBuilder,
    protected httpService: LoginHttpService,
    private router: Router,
    private route: ActivatedRoute,
    private _notificationsService: NotificationsService
  ) {

    this.getServer();

    this.form = fb.group({
      'server': [this.server, Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'account_password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.email = this.form.controls['email'];
    this.account_password = this.form.controls['account_password'];

    this.formRegister = fb.group({
      title: ['Mr', [Validators.minLength(0), Validators.maxLength(3)]],
      firstname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      account_password: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]],
    });

    this.checkAdmin();
    this.checkServerList();

  }

  gen: any = { "app_component_id": 0, "_title": "Login", "_word": "Sign In to your account", "_title2": "Sign Up", "_subsignup": "Please Contact Your System admin to give you a account to login", "_comname": "BIZystem", "_comnamebold": "By Inovasi Labs", "_comyear": "2019", "ph_usernamer": "Username", "ph_password": "Password", "btn_login": "Login", "btn_forgot": "Forgot Password", "btn_register": "Register Now!" };

  private subParam: any;

  ngOnInit() {

    window.scrollTo(0, 0);

    this.subParam = this.route.params.subscribe(params => {
      if (params['id']) {
        this.loginHidden = true;
        this.router.navigateByUrl('/login');
        window.location.reload();
      } else {
        this.httpService.authorization2(false).then(value => {

          if (value) {
            this.router.navigateByUrl('/ts/dashboard');
          } else {
            this.loginHidden = false;
          }
        });
      }

    });

  }

  getServer() {
    if (localStorage.getItem('server')) {
      this.server = localStorage.getItem('server').replace('http://', '');
    } else {
      this.server = "type-script.com:50000";
    }
  }

  serverList: any = [];
  setServer() {

    localStorage.setItem('server', 'http://' + this.form.value.server);

    this.checkServerList();

    this.serverList.push({ server: this.form.value.server });
    localStorage.setItem('serverList', JSON.stringify(this.serverList));

    this.httpService.setbaseURL();
    this.isThereAdmin = 1;
    this.checkAdmin();

  }

  setFromServerList(str) {
    this.form.controls['server'].setValue(str);
    localStorage.setItem('server', 'http://' + str);
    this.httpService.setbaseURL();
    this.isThereAdmin = 1;
    this.checkAdmin();
  }

  checkServerList() {
    if (localStorage.getItem('serverList')) {
      try {
        this.serverList = JSON.parse(localStorage.getItem('serverList'));
      } catch (error) {
        this.serverList = JSON.parse("[]");
      }
    } else {
      this.serverList = JSON.parse("[]");
    }
  }

  removeFromServerList(index) {
    this.serverList.splice(index, 1);
    localStorage.setItem('serverList', JSON.stringify(this.serverList));
  }

  checkAdmin() {
    this.getServer();

    if (this.server) {
      this.httpService.http_api_get('apps/login')
        .subscribe((value) => {
          if (value.success) {
            if (value.data.employee_account.length > 0) {
              this.isThereAdmin = 1;
            } else {
              this.isThereAdmin = 0;
            }
          } else {
            this.isThereAdmin = 1;
            this._notificationsService.error('ERROR', value.label, this.httpService.error);
          }

        },
          error => {
            this._notificationsService.error('Connection Failed', 'Cannot connect to server, please check your sever', this.httpService.error);
            localStorage.removeItem('server');
            this.getServer();
            this.isThereAdmin = 1;
          });
    }
  }

  public onSubmit(values: Object): void {

    localStorage.setItem('server', 'http://' + this.form.value.server);
    this.httpService.setbaseURL();

    this.httpService.baseUrl = 'http://' + this.form.value.server + '/api/';
    this.httpService.baseAssetsDisc = 'http://' + this.form.value.server + '/assets/';

    this.httpService.login(this.form.getRawValue())
      .subscribe(
        value => {
          if (value.login) {
            if (value.setToken) {
              localStorage.setItem('currentUser', value.token);
              localStorage.setItem('currentCompany', 'ts1');
              localStorage.setItem('currentCustomer', 'ts11');
              localStorage.setItem('profile_picture', this.httpService.baseAssetsDisc + 'account/' + value.data.profile_picture);
              localStorage.setItem('username', value.data.username);
              this.router.navigateByUrl('/ts/dashboard');
            }

          } else {
            console.log(value)
            this._notificationsService.error('ERROR', 'Please check your username and password then try again', this.httpService.error);
          }
        },
        error => {
          this._notificationsService.error('Network Issue', 'Cannot connect to server, please check your sever', this.httpService.error);
        }
      );

  }

  formRegisterSubmit() {
    this.httpService.http_api_put('apps/login', this.formRegister.getRawValue())
      .subscribe((value) => {
        if (value.success) {
          this._notificationsService.success('Success', value.label, this.httpService.success);
          this.isThereAdmin = 1;
        } else {
          this._notificationsService.error('Error', value.label, this.httpService.error);
        }
      },
        error => {
          this._notificationsService.error('Network Issue', 'Cannot connect to server, please check your sever', this.httpService.error);
        });
  }


}
