import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {HttpService} from '../../service/http.service';
import {FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-view-rating',
  templateUrl: './view-rating.component.html',
  styleUrls: ['./view-rating.component.css']
})
export class ViewRatingComponent implements OnInit {
  Ratings:any
  totalratings:number
  id=''
  constructor(public router: Router, public toastr: ToastrService, public http: HttpService, private formBuilder: FormBuilder) {
    if(localStorage.getItem('User')){
      let CurrentUser = JSON.parse(localStorage.getItem('User'));
      this.id = CurrentUser.id;
    }
  }

  ngOnInit(): void {
    this.get_ratings()
  }

  get_ratings(){
    var data = {user_id:this.id};
    this.http.PostAPI('user/get-ratings', data).then((resdata: any) => {
      if (resdata.status == 200) {
        this.Ratings = resdata.data;
        this.totalratings = this.Ratings.length
      } else {
        this.toastr.error(resdata.message);
      }
    }).catch((err) => {
      this.toastr.error(err);
    });
  }

}
