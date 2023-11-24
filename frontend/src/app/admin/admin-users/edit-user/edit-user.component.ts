import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, CanActivate, ActivatedRoute} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;
  id:string;

  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    this.get_data();
    this.VerifyForm()
  }

  get_data(){
    var data = {'id':this.id};
    this.adminhttp.PostAPI('admin/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
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
    this.adminhttp.PostAPI('admin/update-user', data).then((resdata: any) => {
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
