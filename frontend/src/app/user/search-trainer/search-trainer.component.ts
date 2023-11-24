import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-search-trainer',
  templateUrl: './search-trainer.component.html',
  styleUrls: ['./search-trainer.component.css']
})
export class SearchTrainerComponent implements OnInit {
  trainer_id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  about = ''
  avatar = ''
  gym_name = ''
  comment = ''
  tags = ''
  will_take_training_again = ''
  similar_json_data = ''
  json_rating_data = ''
  feedback_created_at = ''
  rating:number
  rating_float = ''
  total_feedback:number
  level_of_difficulty:number
  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const trainer_id = this.route.snapshot.paramMap.get('trainer_id');
    this.trainer_id = trainer_id;
    this.get_data()
    this.get_feedback_Avg_data()
    this.get_rating_data()
  }

  get_data(){
    var data = {trainer_id:this.trainer_id}
    this.http.PostAPI('user/get-trainer-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.similar_json_data = resdata.similar_data;
        this.gym_name = json_data.gym_name
        this.first_name = json_data.first_name
        this.last_name = json_data.last_name
        this.email = json_data.email
        this.phone = json_data.phone
        this.about = json_data.about
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : '';
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  get_feedback_Avg_data(){
    var data = {trainer_id:this.trainer_id}
    this.http.PostAPI('user/get-avg-feedback-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_avg_data = resdata.data;
        this.rating = json_avg_data[0].avg_trainer_rate
        this.rating_float = json_avg_data[0].avg_trainer_rate.toFixed(1)
        this.total_feedback = json_avg_data[0].total_feedback
        this.level_of_difficulty = json_avg_data[0].avg_level_of_difficulty
        this.will_take_training_again = json_avg_data[0].will_take_training_again
        this.comment = json_avg_data[1].comment
        this.feedback_created_at = json_avg_data[1].feedback_created_at
        this.tags = json_avg_data[2][0].tag_name.split(',')
      }
    }).catch((err) => {
      return
    });
  }

  get_rating_data(){
    var data = {trainer_id:this.trainer_id}
    this.http.PostAPI('user/get-trainer-rating-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.json_rating_data = resdata.data;
      }
    }).catch((err) => {
      return
    });
  }

}
