import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective  } from '@angular/forms';
import {HttpService} from '../../service/http.service';

@Component({
  selector: 'app-user-forgot-password',
  templateUrl: './user-forgot-password.component.html',
  styleUrls: ['./user-forgot-password.component.css']
})
export class UserForgotPasswordComponent implements OnInit {

  show_forget_form = true
  verify_form_open = false
  password_form_show = false

  forgot_submitted = false
  verify_submitted = false
  password_submitted = false

  ForgotForm : FormGroup
  verifyForm : FormGroup
  password_Form : FormGroup

  verify_number_global = ''
  user_email : string

  constructor(public router: Router, public toastr: ToastrService, public http: HttpService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.login_verify()
    this.token_verify()
    this.password_verify()
  }
  get fval() {
    return this.ForgotForm.controls;
  }
  get pval() {
    return this.password_Form.controls;
  }
  get vval() {
    return this.verifyForm.controls;
  }

  login_verify(){
    this.ForgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  token_verify(){
    this.verifyForm = this.formBuilder.group({
      verify_token: ['', [Validators.required]]
    })
  }
  password_verify(){
    this.password_Form = this.formBuilder.group({
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]]
    })
  }

  onSubmitForgotForm() {
    this.forgot_submitted = true;
    if (this.ForgotForm.invalid) {
      return;
    }
    var data = this.ForgotForm.value;
    this.user_email = data.email
    this.http.PostAPI('user/forgot-password', data).then((resdata: any) => {
      this.verify_form_open = true
      if (resdata.status == 200) {
        this.show_forget_form = false
        this.verify_form_open = true
        this.toastr.success(resdata.message)
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  onSubmitVerifyCheck(){
    this.verify_submitted = true;
    if (this.verifyForm.invalid) {
      return;
    }
    var data  = {email: this.user_email, verify_token : this.verifyForm.value.verify_token}
    this.verify_number_global = this.verifyForm.value.verify_token;
    this.http.PostAPI('user/verify-otp', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.verify_form_open = false
        this.password_form_show = true
        this.toastr.success(resdata.message)
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  onSubmitPasswordForm(){
    this.password_submitted = true;
    if (this.password_Form.invalid) {
      return;
    }
    var data = this.password_Form.value
    data['email'] = this.user_email
    data['verify_token'] =  this.verify_number_global
    this.http.PostAPI('user/reset-password', data).then((resdata: any) => {
      this.verify_form_open = true
      if (resdata.status == 200) {
        this.toastr.success(resdata.message)
        this.router.navigate(['/login']);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
