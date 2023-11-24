import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';

@Component({
  selector: 'app-find-gym',
  templateUrl: './find-gym.component.html',
  styleUrls: ['./find-gym.component.css']
})
export class FindGymComponent implements OnInit {

  gyms = ''
  form_submitted = false;
  AddForm:FormGroup;
  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.VerifyForm()
    this.get_data()
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      gym_id: ['', [Validators.required]],
      country: ['', [Validators.required]]
    })
  }

  get fval() {
    return this.AddForm.controls;
  }

  get_data(){
    var data = {}
    this.http.PostAPI('user/get-gyms', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.gyms = resdata.data;
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
    this.http.PostAPI('user/find-gym', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.router.navigate(["/view-all-instructors",resdata.data]);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
