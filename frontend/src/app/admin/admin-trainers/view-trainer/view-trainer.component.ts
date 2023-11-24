import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-view-trainer',
  templateUrl: './view-trainer.component.html',
  styleUrls: ['./view-trainer.component.css']
})
export class ViewTrainerComponent implements OnInit {
  avatar = ''
  first_name = ''
  last_name = ''
  about = ''
  email = ''
  phone = ''
  rating:number
  trainer_id = ''

  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const trainer_id = this.route.snapshot.paramMap.get('id');
    this.trainer_id = trainer_id;
    this.get_data();
  }

  get_data(){
    var data = {trainer_id:this.trainer_id};
    this.adminhttp.PostAPI('admin/get-trainer-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : environment.root_url+'upload/trainer-file-icon.svg';
        this.first_name = json_data.first_name
        this.last_name = json_data.last_name
        this.about = json_data.about
        this.email = json_data.email
        this.phone = json_data.phone
        this.rating = parseInt(json_data.rating)
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
