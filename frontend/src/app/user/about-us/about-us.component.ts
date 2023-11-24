import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../service/http.service';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.css'],
})
export class AboutUsComponent implements OnInit {
  BlogData: any;
  TrainersSlides: any;

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
    this.get_trainers();
    this.get_blog();
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
    autoplay: true,
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
}
