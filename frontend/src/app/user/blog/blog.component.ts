import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  BlogData:any
  BlogData1:any
  BlogData2:any
  BlogData3:any
  constructor(public router: Router, public toastr: ToastrService, public http: HttpService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.get_blog()
  }

  get_blog(){
    var data = {};
    this.http.PostAPI('user/get-all-blogs', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.BlogData = resdata.data;
        this.BlogData1 = resdata.type1;
        this.BlogData2 = resdata.type2;
        this.BlogData3 = resdata.type3;
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
