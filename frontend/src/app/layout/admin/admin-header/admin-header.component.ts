import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  id = ''
  first_name = ''
  last_name = ''
  avatar = ''
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService){
    if(localStorage.getItem('AdminUser')){
      let CurrentAdmin = JSON.parse(localStorage.getItem('AdminUser'));
      this.id = CurrentAdmin.id;
    }
  }

  ngOnInit(): void {
    this.get_data();
  }

  get_data(){
    var data = {'id':this.id};
    this.adminhttp.PostAPI('admin/get_data', data).then((resdata: any) => {
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
    localStorage.removeItem('AdminUser');
    localStorage.removeItem('AdminToken');
    this.adminhttp.Admintoken = '';
    this.adminhttp.IsAdminLogin = false;
    this.router.navigate(['admin/login']);
  }

}
