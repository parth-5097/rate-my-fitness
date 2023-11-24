import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TrainerHttpService} from '../../../service/trainer-http.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-trainer-header',
  templateUrl: './trainer-header.component.html',
  styleUrls: ['./trainer-header.component.css']
})
export class TrainerHeaderComponent implements OnInit {

  trainer_id = ''
  first_name = ''
  last_name = ''
  avatar = ''
  IsTrainerLogin = false
  constructor(public router: Router, private toastr: ToastrService, public trainerhttp: TrainerHttpService) {
    if(localStorage.getItem('Trainer')){
      let CurrentUser = JSON.parse(localStorage.getItem('Trainer'));
      this.trainer_id = CurrentUser.trainer_id;
    }
  }

  ngOnInit(): void {
    this.IsTrainerLogin = this.trainerhttp.IsTrainerLogin
    if(this.IsTrainerLogin == true){
      this.get_data()
    }
  }

  get_data(){
    var data = {trainer_id:this.trainer_id};
    this.trainerhttp.PostAPI('trainer/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.first_name = json_data.first_name;
        this.last_name = json_data.last_name;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : environment.root_url+'upload/pic-pro.png';
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  logout(){
    localStorage.removeItem('Trainer');
    localStorage.removeItem('TrainerToken');
    this.trainerhttp.TrainerToken = '';
    this.trainerhttp.IsTrainerLogin = false;
    this.router.navigate(['/trainer/login']);
  }

}
