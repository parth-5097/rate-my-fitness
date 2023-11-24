import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {HttpService} from '../../service/http.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {
  email = ''
  constructor(public router: Router, public toastr: ToastrService, public http: HttpService, private formBuilder: FormBuilder, private location: Location,private route: ActivatedRoute) { }

  ngOnInit(): void {
    const email = this.route.snapshot.paramMap.get('email');
    this.email = email;
    this.get_data();
  }

  get_data(){
    var data = {email:this.email}
    this.http.PostAPI('user/verify-account', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
