import { Component, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';
import {AdminHeaderComponent} from '../../layout/admin/admin-header/admin-header.component';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ConfirmedValidator } from '../../confirmed.validator';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  @ViewChild(AdminHeaderComponent) get_header_data
  id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  avatar = ''
  public show_model = false;
  ChangePasswordForm:FormGroup
  password_submitted = false;

  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder){
    if(localStorage.getItem('AdminUser')){
      let CurrentAdmin = JSON.parse(localStorage.getItem('AdminUser'));
      this.id = CurrentAdmin.id;
    }
  }

  ngOnInit(): void {
    this.get_data();
    this.verify_form();
  }

  get fval() {
    return this.ChangePasswordForm.controls;
  }

  verify_form(){
    this.ChangePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required,Validators.minLength(6)]],
      newpassword: ['', [Validators.required,Validators.minLength(6)]],
      retypepassword: ['', [Validators.required,Validators.minLength(6)]]
    }, {
      validator: ConfirmedValidator('newpassword', 'retypepassword')
    });
  }

  get_data(){
    var data = {'id':this.id};
    this.adminhttp.PostAPI('admin/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.first_name = json_data.first_name;
        this.last_name = json_data.last_name;
        this.phone = json_data.phone;
        this.email = json_data.email;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : environment.root_url+'upload/pic-pro.png';
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  open_model(){
    this.show_model = true;
  }

  close_model(){
    this.show_model = false;
  }

  ChangePassword(){
    this.password_submitted = true;
    if (this.ChangePasswordForm.invalid) {
      return;
    }
    var data = this.ChangePasswordForm.value;
    data.id = this.id
    this.adminhttp.PostAPI('admin/change-password', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }
}
