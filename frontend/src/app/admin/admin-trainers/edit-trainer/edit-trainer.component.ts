import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit-trainer',
  templateUrl: './edit-trainer.component.html',
  styleUrls: ['./edit-trainer.component.css']
})
export class EditTrainerComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;
  avatar = ''
  file = ''
  trainer_id = ''
  gym_id = ''
  gyms = ''
  rating:number
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const trainer_id = this.route.snapshot.paramMap.get('id');
    this.trainer_id = trainer_id;
    this.get_gym_data()
    this.get_data();
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

  get_data(){
    var data = {trainer_id:this.trainer_id};
    this.adminhttp.PostAPI('admin/get-trainer-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : '';
        this.rating = parseInt(json_data.rating)
        if(json_data.gym_id != null){
          this.gym_id = json_data.gym_id
        }
        this.AddForm = this.formBuilder.group({
          first_name: [json_data.first_name, [Validators.required]],
          last_name: [json_data.last_name, [Validators.required]],
          about: [json_data.about, [Validators.required]],
          email: [json_data.email, [Validators.required, Validators.email]],
          phone: [json_data.phone, [Validators.required, Validators.pattern("[0-9 ]{10}")]],
          stars: [this.rating],
          gym_id: [this.gym_id]
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
    form_data.append('trainer_id',this.trainer_id)
    this.adminhttp.PostAPI('admin/update-trainer',form_data).then((resdata: any) => {
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
