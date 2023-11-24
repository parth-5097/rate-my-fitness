import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../service/adminhttp.service';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AdminHeaderComponent} from '../../layout/admin/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-edit-profile',
  templateUrl: './admin-edit-profile.component.html',
  styleUrls: ['./admin-edit-profile.component.css']
})
export class AdminEditProfileComponent implements OnInit {
  @ViewChild(AdminHeaderComponent) get_header_data
  submitted = false;
  updateProfileForm : FormGroup;
  id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  avatar = ''
  file = ''
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location){
    if(localStorage.getItem('AdminUser')){
      let CurrentAdmin = JSON.parse(localStorage.getItem('AdminUser'));
      this.id = CurrentAdmin.id;
    }
  }

  ngOnInit(): void {
    this.get_data();
    this.verify_form()
  }

  get_data(){
    var data = {'id':this.id};
    this.adminhttp.PostAPI('admin/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.first_name = json_data.first_name;
        this.last_name = json_data.last_name;
        this.email = json_data.email;
        this.phone = json_data.phone;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : environment.root_url+'upload/pic-pro.png';
        this.updateProfileForm = this.formBuilder.group({
          first_name: [this.first_name, [Validators.required]],
          last_name: [this.last_name, [Validators.required]],
          email: [this.email, [Validators.required, Validators.email]],
          phone: [this.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]]
        })
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  verify_form(){
    this.updateProfileForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]]
    })
  }

  get fval() {
    return this.updateProfileForm.controls;
  }

  upload(evt) {
    if (evt.target) {
      this.file = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.avatar = event.target.result;
      }
      reader.readAsDataURL(evt.target.files[0]);
    }
  }

  updateProfile(){
    this.submitted = true;
    if (this.updateProfileForm.invalid) {
      return;
    }
    var data = this.updateProfileForm.value;
    var form_data  = new FormData()
    for ( var key in data ) {
      form_data.append(key, data[key]);
    }
    if(this.file){
      form_data.append('avatar',this.file)
    }
    form_data.append('id',this.id)
    this.adminhttp.PostAPI('admin/update-profile', form_data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.get_data();
        this.get_header_data.get_data();
        this.toastr.success(resdata.message);
        this.router.navigate(['admin/profile']);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  cancel() {
    this.location.back();
  }

}
