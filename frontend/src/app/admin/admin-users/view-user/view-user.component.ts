import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {FormBuilder, Validators} from '@angular/forms';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  id = ''
  first_name = ''
  last_name = ''
  email = ''
  phone = ''
  constructor(public router: Router, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    this.get_data();
  }

  get_data(){
    var data = {'id':this.id};
    this.adminhttp.PostAPI('admin/get_data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.first_name = resdata.data.first_name
        this.last_name = resdata.data.last_name
        this.email = resdata.data.email
        this.phone = resdata.data.phone
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
