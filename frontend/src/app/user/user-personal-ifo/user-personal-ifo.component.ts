import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user-personal-ifo',
  templateUrl: './user-personal-ifo.component.html',
  styleUrls: ['./user-personal-ifo.component.css']
})
export class UserPersonalIfoComponent implements OnInit {

  id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  avatar = ''
  constructor(public router: Router, private toastr: ToastrService, private http:HttpService) {
    if(localStorage.getItem('User')){
      let CurrentUser = JSON.parse(localStorage.getItem('User'));
      this.id = CurrentUser.id;
    }
  }

  ngOnInit(): void {
    this.get_data()
  }

  get_data(){
    var data = {'id':this.id};
    this.http.PostAPI('user/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.first_name = json_data.first_name;
        this.last_name = json_data.last_name;
        this.email = json_data.email;
        this.phone = json_data.phone;
        this.avatar = (json_data.avatar != null && json_data.avatar != '') ? environment.root_url+''+json_data.avatar : environment.root_url+'upload/pic-pro.png';
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }


}
