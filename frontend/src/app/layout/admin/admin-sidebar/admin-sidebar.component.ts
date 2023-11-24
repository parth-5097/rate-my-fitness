import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(public router: Router, private toastr: ToastrService,public adminhttp: AdminhttpService){}

  ngOnInit(): void {
  }

  logout(){
    localStorage.removeItem('AdminUser');
    localStorage.removeItem('AdminToken');
    this.adminhttp.Admintoken = '';
    this.adminhttp.IsAdminLogin = false;
    this.router.navigate(['admin/login']);
  }
}
