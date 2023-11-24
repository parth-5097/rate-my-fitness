import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AdminhttpService} from '../../../service/adminhttp.service';
import {Location} from '@angular/common';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css']
})
export class EditBlogComponent implements OnInit {

  form_submitted = false;
  AddForm : FormGroup;
  blog_image = ''
  file = ''
  id = ''
  constructor(public router: Router, private route: ActivatedRoute, public toastr: ToastrService, public adminhttp: AdminhttpService, private formBuilder: FormBuilder, private location: Location) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.id = id;
    this.get_data()
    this.VerifyForm()
  }

  get_data(){
    var data = {id:this.id};
    this.adminhttp.PostAPI('admin/get-blog-data', data).then((resdata: any) => {
      if (resdata.status == 200) {
        var json_data = resdata.data;
        this.blog_image = (json_data.blog_image != null && json_data.blog_image != '') ? environment.root_url+''+json_data.blog_image : '';
        this.AddForm = this.formBuilder.group({
          type: [json_data.type, [Validators.required]],
          title: [json_data.title, [Validators.required]],
          description: [json_data.description, [Validators.required]]
        })
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  VerifyForm(){
    this.AddForm = this.formBuilder.group({
      type: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }

  get fval() {
    return this.AddForm.controls;
  }

  upload(evt) {
    if (evt.target) {
      this.file = evt.target.files[0];
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.blog_image = event.target.result;
      }
      reader.readAsDataURL(evt.target.files[0]);
    }
  }

  onSubmitForm(){
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var data = this.AddForm.value
    var form_data  = new FormData()
    for ( var key in data ) {
      form_data.append(key, data[key]);
    }
    if(this.file){
      form_data.append('blog_image',this.file)
    }
    form_data.append('id',this.id)
    this.adminhttp.PostAPI('admin/update-blog',form_data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.toastr.success(resdata.message);
        this.router.navigate(['admin/blogs']);
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

  cancel() {
    this.location.back();
  }

}
