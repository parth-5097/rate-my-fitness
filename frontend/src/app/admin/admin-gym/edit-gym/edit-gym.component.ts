import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit-gym',
  templateUrl: './edit-gym.component.html',
  styleUrls: ['./edit-gym.component.css']
})
export class EditGymComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;
  gym_avatar = ''
  file = ''
  gym_id=''
  constructor(public router: Router, private route: ActivatedRoute, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.gym_id = id;
    this.get_data();
    this.VerifyForm()
  }

  get_data(){
    var data = {'gym_id':this.gym_id};
    this.adminhttp.PostAPI('admin/get-gym-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.AddForm = this.formBuilder.group({
          gym_name: [json_data.gym_name, [Validators.required]],
          description: [json_data.description, [Validators.required]],
          country: [json_data.country, [Validators.required]],
          suite_number: [json_data.suite_number, [Validators.required]],
          street_address: [json_data.street_address, [Validators.required]],
          city: [json_data.city, [Validators.required]],
          state: [json_data.state, [Validators.required]],
          zipcode: [json_data.zipcode, [Validators.required]],
          phone: [json_data.phone, [Validators.required,Validators.pattern("[0-9 ]{10}")]]
        })
        this.gym_avatar = (json_data.gym_avatar != null && json_data.gym_avatar != '') ? environment.root_url+''+json_data.gym_avatar : '';
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
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
    form_data.append('gym_id',this.gym_id)
    this.adminhttp.PostAPI('admin/update-gym', form_data).then((resdata: any) => {
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
