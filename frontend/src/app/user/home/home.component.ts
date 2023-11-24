import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../service/http.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  options: string[] = ['trainer', 'gym', 'rate'];
  BlogData: any;
  TrainersSlides: any;
  form_submitted = false;
  AddForm: FormGroup;
  slides = [
    { img: 'assets/images/home-slider-img-1.png' },
    { img: 'assets/images/home-slider-img-1.png' },
    { img: 'assets/images/home-slider-img-1.png' },
  ];

  TestiMonialslides = [
    {
      img: 'assets/images/testimonial-pic-1.png',
      title: 'john doe',
      about:
        'Working with rewardStyle has been a huge asset and blessing to my life and career',
    },
    {
      img: 'assets/images/testimonial-pic-1.png',
      title: 'john doe',
      about:
        'Working with rewardStyle has been a huge asset and blessing to my life and career',
    },
    {
      img: 'assets/images/testimonial-pic-1.png',
      title: 'john doe',
      about:
        'Working with rewardStyle has been a huge asset and blessing to my life and career',
    },
  ];
  constructor(
    public router: Router,
    public toastr: ToastrService,
    public http: HttpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.get_trainers();
    // this.get_blog();
    // this.VerifyForm();
  }

  VerifyForm() {
    this.AddForm = this.formBuilder.group({
      search: [],
    });
  }

  slideConfigDash = {
    arrows: true,
    dots: true,
    speed: 900,
    infinite: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    touchThreshold: 500,
    autoplay: false,
    autoplaySpeed: 2000,
  };

  slideConfigTest = {
    arrows: true,
    dots: false,
    speed: 900,
    infinite: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    touchThreshold: 500,
    autoplay: false,
    autoplaySpeed: 2000,
  };

  slideConfig = {
    arrows: false,
    dots: false,
    infinite: true,
    cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
    touchThreshold: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  get_trainers() {
    var data = {};
    this.http
      .PostAPI('user/get-trainers', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          this.TrainersSlides = resdata.data.filter(
            (el) =>
              (el.avatar =
                el.avatar != null && el.avatar != ''
                  ? el.avatar.match('upload/') != null
                    ? environment.root_url + el.avatar
                    : el.avatar
                  : environment.root_url + 'upload/pic-pro.png')
          );
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }

  get_blog() {
    var data = {};
    this.http
      .PostAPI('user/get-blogs', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          this.BlogData = resdata.data;
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }

  get fval() {
    return this.AddForm.controls;
  }

  onSearch() {
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var search = this.AddForm.value.search;
    if (search == 'trainer') {
      this.router.navigate(['/find-my-trainer']);
    } else if (search == 'gym') {
      this.router.navigate(['/find-gym']);
    } else if (search == 'rate') {
      this.router.navigate(['/view-rating']);
    }
  }

  search(event) {
    var search = event.target.value;
    let search_name = this.options.filter((x) => x === search)[0];
    if (search_name == 'trainer') {
      this.router.navigate(['/find-my-trainer']);
    } else if (search_name == 'gym') {
      this.router.navigate(['/find-gym']);
    } else if (search_name == 'rate') {
      this.router.navigate(['/view-rating']);
    }
  }
}
