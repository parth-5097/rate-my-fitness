import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../service/http.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css'],
})
export class TrainerComponent implements OnInit {
  TrainersSlides: any;
  constructor(
    public router: Router,
    public toastr: ToastrService,
    public http: HttpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.get_trainers();
  }

  get_trainers() {
    var data = {};
    this.http
      .PostAPI('user/get-trainers', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          this.TrainersSlides = resdata.data.filter(
            (el) =>
              (el.avatar =
                el.avatar != null && el.avatar != ''
                  ? el.avatar.match('upload/') != null
                    ? environment.root_url + el.avatar
                    : el.avatar
                  : environment.root_url + 'upload/pic-pro.png')
          );
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }
}
