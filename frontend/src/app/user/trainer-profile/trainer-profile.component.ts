import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/service/http.service';

@Component({
  selector: 'app-trainer-profile',
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.css'],
})
export class TrainerProfileComponent implements OnInit {
  trainerData: any;
  similar_trainer_data: any;
  constructor(
    private http: HttpService,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      this.get_trainers_data(data.trainer_id);
    });
  }

  get_trainers_data(trainer_id) {
    var data = {
      trainer_id: trainer_id,
    };
    this.http
      .PostAPI('user/get-trainer-data', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          this.trainerData = resdata.data;
          this.similar_trainer_data = resdata.similar_data;
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((e) => {
        this.toastr.error('Something went wrong');
      });
  }
}
