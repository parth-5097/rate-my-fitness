import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../../service/http.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
})
export class UserHeaderComponent implements OnInit {
  id = '';
  first_name = '';
  last_name = '';
  avatar = '';
  IsUserLogin = false;

  constructor(
    public router: Router,
    private toastr: ToastrService,
    private http: HttpService
  ) {
    if (
      localStorage.getItem('User') !== 'undefined' &&
      localStorage.getItem('User')
    ) {
      this.id = JSON.parse(localStorage.getItem('User')).id;
    }
  }

  ngOnInit(): void {
    this.IsUserLogin = this.http.IsUserLogin;
    if (this.IsUserLogin == true) {
      this.get_data();
    }
  }

  get_data() {
    var data = { id: this.id };
    this.http
      .PostAPI('user/get_data', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          var json_data = resdata.data;
          this.first_name = json_data.first_name;
          this.last_name = json_data.last_name;
          this.avatar =
            json_data.avatar != null && json_data.avatar != ''
              ? environment.root_url + '' + json_data.avatar
              : environment.root_url + 'upload/pic-pro.png';
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }

  logout() {
    localStorage.removeItem('User');
    localStorage.removeItem('Token');
    this.http.token = '';
    this.http.IsUserLogin = false;
    this.router.navigate(['/login']);
  }
}
