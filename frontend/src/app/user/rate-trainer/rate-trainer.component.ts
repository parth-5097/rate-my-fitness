import {ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// @ts-ignore
import { Select2OptionData } from 'ngSelect2';
import { Options } from 'select2';

@Component({
  selector: 'app-rate-trainer',
  templateUrl: './rate-trainer.component.html',
  styleUrls: ['./rate-trainer.component.css']
})
export class RateTrainerComponent implements OnInit {
  trainer_id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  about = ''
  avatar = ''
  gym_name = ''
  id = ''
  Exercises = ''
  rating:number;
  form_submitted = false;
  AddForm:FormGroup;
  is_online_training = 1

  public tagsList: Array<Select2OptionData>;
  public options: Options;
  value = ''

  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    if(localStorage.getItem('User')){
      let CurrentUser = JSON.parse(localStorage.getItem('User'));
      this.id = CurrentUser.id;
    }
  }

  ngOnInit(): void {
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    this.trainer_id = trainer_id;
    this.get_feedback_data();
    this.get_data()
    this.VerifyForm()
    this.get_exercises_data()
    this.get_tags()
    this.options = {
      width: '500',
      multiple: true,
      tags: true
    };
  }

  get_tags(){
    var data = {}
    this.http.PostAPI('user/get-tags', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.tagsList = resdata.data
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  get_feedback_data(){
    var data = {user_id:this.id,trainer_id:this.trainer_id}
    this.http.PostAPI('user/get-feedback-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var get_json_data = resdata.data
        this.value = get_json_data.tags
        this.is_online_training = get_json_data.is_online_training
        this.AddForm = this.formBuilder.group({
          exercise_id: [get_json_data.exercise_id, [Validators.required]],
          trainer_rate: [get_json_data.trainer_rate, [Validators.required]],
          level_of_difficulty: [get_json_data.level_of_difficulty, [Validators.required]],
          is_online_training: [],
          will_take_training_again: [get_json_data.will_take_training_again.toString(), [Validators.required]],
          comment: [get_json_data.comment, [Validators.required]],
          tags: [this.value, [Validators.required]]
        })
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      exercise_id: ['', [Validators.required]],
      trainer_rate: ['', [Validators.required]],
      level_of_difficulty: ['', [Validators.required]],
      is_online_training: [this.is_online_training],
      will_take_training_again: ['1', [Validators.required]],
      comment: ['', [Validators.required]],
      tags: [this.value, [Validators.required]]
    })
  }

  get fval() {
    return this.AddForm.controls;
  }

  get_exercises_data(){
    var data = {}
    this.http.PostAPI('user/get-exercises-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.Exercises = resdata.data;
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  get_data(){
    var data = {trainer_id:this.trainer_id}
    this.http.PostAPI('user/get-trainer-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.gym_name = json_data.gym_name
        this.first_name = json_data.first_name
        this.last_name = json_data.last_name
        this.email = json_data.email
        this.phone = json_data.phone
        this.about = json_data.about
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : '';
        this.rating = parseInt(json_data.rating)
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
    data['trainer_id'] = this.trainer_id
    data['user_id'] = this.id
    this.http.PostAPI('user/rate-trainer', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.router.navigate(["/search-trainer",resdata.data]);
        this.toastr.success(resdata.message);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  change_status(is_online_training){
    if(is_online_training == 0){
      this.is_online_training = 1
    }else{
      this.is_online_training = 0
    }
  }



}
