import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-find-my-trainer',
  templateUrl: './find-my-trainer.component.html',
  styleUrls: ['./find-my-trainer.component.css']
})
export class FindMyTrainerComponent implements OnInit {
  trainers = ''
  form_submitted = false;
  AddForm:FormGroup;
  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.VerifyForm()
    this.get_data()
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      trainer_id: ['', [Validators.required]]
    })
  }

  get fval() {
    return this.AddForm.controls;
  }

  get_data(){
    var data = {}
    this.http.PostAPI('user/get-trainers', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.trainers = resdata.data;
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  onSubmitForm(){
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var data = this.AddForm.value;
    this.http.PostAPI('user/find-trainer', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.router.navigate(["/search-trainer",resdata.data]);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
