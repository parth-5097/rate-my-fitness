import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  avatar = ''
  form_submitted = false;
  AddForm : FormGroup;

  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private formBuilder: FormBuilder) {
    if(localStorage.getItem('User')){
      let CurrentUser = JSON.parse(localStorage.getItem('User'));
      this.id = CurrentUser.id;
    }
  }

  ngOnInit(): void {
    this.get_data()
    this.VerifyForm()
  }

  get_data(){
    var data = {'id':this.id};
    this.http.PostAPI('user/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.first_name = json_data.first_name;
        this.last_name = json_data.last_name;
        this.email = json_data.email;
        this.phone = json_data.phone;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : environment.root_url+'upload/pic-pro.png';
        this.AddForm = this.formBuilder.group({
          first_name: [json_data.first_name, [Validators.required]],
          last_name: [json_data.last_name, [Validators.required]],
          email: [json_data.email, [Validators.required, Validators.email]],
          phone: [json_data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]]
        })
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required,Validators.pattern("[0-9 ]{10}")]]
    })
  }

  get fval() {
    return this.AddForm.controls;
  }

  onSubmitForm(){
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var data = this.AddForm.value;
    data.id = this.id;
    this.http.PostAPI('user/update-user', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
        this.router.navigate(['/personal-info']);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
