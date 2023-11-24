import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.css']
})
export class ViewBlogComponent implements OnInit {
  title = ''
  description = ''
  date = ''
  blog_image = ''
  id:string

  constructor(public router: Router, private route: ActivatedRoute, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    this.get_data();
  }

  get_data(){
    var data = {id:this.id}
    this.adminhttp.PostAPI('admin/get-blog-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.title = json_data.title
        this.description = json_data.description
        this.date = json_data.created_at
        this.blog_image = environment.root_url+''+json_data.blog_image
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }


}
