import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { TrainerHttpService } from '../../service/trainer-http.service';

@Component({
  selector: 'app-trainer-my-account',
  templateUrl: './trainer-my-account.component.html',
  styleUrls: ['./trainer-my-account.component.css'],
})
export class TrainerMyAccountComponent implements OnInit {
  trainer_id = '';
  first_name = '';
  last_name = '';
  avatar = '';
  constructor(
    public router: Router,
    private toastr: ToastrService,
    public trainerhttp: TrainerHttpService
  ) {
    if (localStorage.getItem('Trainer')) {
      this.trainer_id = JSON.parse(localStorage.getItem('Trainer')).trainer_id;
    }
  }

  ngOnInit(): void {
    this.get_data();
  }

  get_data() {
    var data = { trainer_id: this.trainer_id };
    this.trainerhttp
      .PostAPI('trainer/get_data', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          var json_data = resdata.data;
          this.first_name = json_data.first_name;
          this.last_name = json_data.last_name;
          this.avatar =
            json_data.avatar != null && json_data.avatar != ''
              ? json_data.avatar.startsWith('http') != null
                ? json_data.avatar
                : environment.root_url + '' + json_data.avatar
              : environment.root_url + 'upload/pic-pro.png';
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        console.log(err);
        this.toastr.error('Error occured while retriving data from server');
      });
  }
}
