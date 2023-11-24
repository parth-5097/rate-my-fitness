import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-gym',
  templateUrl: './add-gym.component.html',
  styleUrls: ['./add-gym.component.css']
})
export class AddGymComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;
  gym_avatar = ''
  file = ''
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    this.VerifyForm()
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      gym_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      country: ['', [Validators.required]],
      suite_number: ['', [Validators.required]],
      street_address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      phone: ['', [Validators.required,Validators.pattern("[0-9 ]{10}")]]
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
        this.gym_avatar = event.target.result;
      }
      reader.readAsDataURL(evt.target.files[0]);
    }
  }

  onSubmitForm(){
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var data = this.AddForm.value;
    var form_data  = new FormData()
    for ( var key in data ) {
      form_data.append(key, data[key]);
    }
    if(this.file){
      form_data.append('gym_avatar',this.file)
    }
    this.adminhttp.PostAPI('admin/add-gym', form_data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
        this.router.navigate(['admin/gym']);
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
