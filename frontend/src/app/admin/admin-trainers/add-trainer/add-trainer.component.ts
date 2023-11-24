import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-trainer',
  templateUrl: './add-trainer.component.html',
  styleUrls: ['./add-trainer.component.css']
})
export class AddTrainerComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;
  avatar = ''
  file = ''
  gyms = ''
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.get_gym_data()
    this.VerifyForm()
  }

  get_gym_data(){
    var data = {}
    this.adminhttp.PostAPI('admin/get-gyms', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.gyms = resdata.data;
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
      about: ['', [Validators.required]],
      email: ['', [Validators.required,Validators.email]],
      phone: ['', [Validators.required,Validators.pattern("[0-9 ]{10}")]],
      stars: ['1'],
      gym_id: ['']
    })
  }

  get fval() {
    return this.AddForm.controls;
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

  onSubmitForm(){
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var data = this.AddForm.value
    var form_data  = new FormData()
    for ( var key in data ) {
      form_data.append(key, data[key]);
    }
    if(this.file){
      form_data.append('avatar',this.file)
    }
    this.adminhttp.PostAPI('admin/add-trainer',form_data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
        this.router.navigate(['admin/trainers']);
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
