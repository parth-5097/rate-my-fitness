import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-view-all-instructors',
  templateUrl: './view-all-instructors.component.html',
  styleUrls: ['./view-all-instructors.component.css']
})
export class ViewAllInstructorsComponent implements OnInit {

  gym_id = ''
  gym_name = ''
  gym_avatar = ''
  get_json_data = ''
  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const gym_id = this.route.snapshot.paramMap.get('gym_id');
    this.gym_id = gym_id;
    this.get_data()
    this.get_gym_trainer_data()
  }

  get_data(){
    var data = {gym_id:this.gym_id}
    this.http.PostAPI('user/get-gym-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.gym_name = json_data.gym_name
        this.gym_avatar = (json_data.gym_avatar != null && json_data.gym_avatar != '') ? environment.root_url+''+json_data.gym_avatar : 'assets/images/hero-slide-img-1.png';
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  get_gym_trainer_data(){
    var data = {gym_id:this.gym_id}
    this.http.PostAPI('user/get-gym-trainer-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.get_json_data = resdata.data;
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  search_instructors(event: any){
    var data = {gym_id:this.gym_id,search:event.target.value}
    this.http.PostAPI('user/search-gym-trainer-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.get_json_data = resdata.data;
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
