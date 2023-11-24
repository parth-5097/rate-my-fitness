import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../../service/http.service';
import {FormBuilder} from '@angular/forms';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {

  blog_id = ''
  title = ''
  description = ''
  date = ''
  blog_image = ''
  constructor(public router: Router, private toastr: ToastrService, private http:HttpService, private route: ActivatedRoute, private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const blog_id = this.route.snapshot.paramMap.get('blog_id');
    this.blog_id = blog_id;
    this.get_data();
  }

  get_data(){
    var data = {blog_id:this.blog_id}
    this.http.PostAPI('user/get-blog-data', data).then((resdata: any) => {
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
