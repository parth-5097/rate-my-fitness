import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;

  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.VerifyForm()
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
    this.adminhttp.PostAPI('admin/add-user', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
        this.router.navigate(['admin/users']);
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
