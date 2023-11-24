import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;

  constructor(public router: Router, public toastr: ToastrService, public http: HttpService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.VerifyForm()
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required,Validators.pattern("[0-9 ]{10}")]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
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
    this.http.PostAPI('user/contact-us', data).then((resdata: any) => {
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
