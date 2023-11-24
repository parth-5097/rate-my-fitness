import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-gym',
  templateUrl: './view-gym.component.html',
  styleUrls: ['./view-gym.component.css']
})
export class ViewGymComponent implements OnInit {

  gym_id:string
  gym_name = ''
  description = ''
  country = ''
  suite_number = ''
  street_address = ''
  city = ''
  state = ''
  zipcode = ''
  phone = ''
  gym_avatar = ''

  constructor(public router: Router, private route: ActivatedRoute, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.gym_id = id;
    this.get_data();
  }

  get_data(){
    var data = {'gym_id':this.gym_id};
    this.adminhttp.PostAPI('admin/get-gym-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.gym_name = json_data.gym_name
        this.description = json_data.description
        this.country = json_data.country
        this.suite_number = json_data.suite_number
        this.street_address = json_data.street_address
        this.city = json_data.city
        this.state = json_data.state
        this.zipcode = json_data.zipcode
        this.phone = json_data.phone
        this.gym_avatar = environment.root_url+''+json_data.gym_avatar
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
