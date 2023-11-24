import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  loginForm:FormGroup;
  IsLoginFormValid = false;
  constructor(public toastr: ToastrService,public adminhttp: AdminhttpService,public router: Router) { }

  ngOnInit(): void {
    this.loginform()
  }

  get fval() {
    return this.loginForm.controls;
  }

  loginform(){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  login(){
    this.IsLoginFormValid = true;
    if (this.loginForm.invalid) {
      return;
    }
    var data = this.loginForm.value;
    this.adminhttp.PostAPI('admin/login', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.adminhttp.Admintoken = resdata.token;
        localStorage.setItem('AdminUser', JSON.stringify(resdata.data));
        localStorage.setItem('AdminToken', resdata.token);
        this.adminhttp.IsAdminLogin = true;
        this.toastr.success(resdata.message);
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error('System error. try again later.');
    });
  }

}
