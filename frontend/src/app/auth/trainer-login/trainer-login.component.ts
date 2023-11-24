import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TrainerHttpService } from '../../service/trainer-http.service';

declare var FB: any;

@Component({
  selector: 'app-trainer-login',
  templateUrl: './trainer-login.component.html',
  styleUrls: ['./trainer-login.component.css'],
})
export class TrainerLoginComponent implements OnInit {
  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;
  form_submitted = false;
  AddForm: FormGroup;
  auth2;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public trainerhttp: TrainerHttpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.facebookInitializer();
    this.googleInitializer();
    this.VerifyForm();
  }

  facebookInitializer() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '264769331672265',
        cookie: true,
        xfbml: true,
        version: 'v9.0',
      });
      FB.AppEvents.logPageView();
    };
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  googleInitializer() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id:
            '1134711475-e5srlutjvni0j3nk28bs2f2ohad1kvtr.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email',
        });
        this.prepareLogin();
      });
    };
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'google-jssdk');
  }

  VerifyForm() {
    this.AddForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submitLogin() {
    FB.login(
      (response) => {
        if (response.authResponse) {
          FB.api(
            '/me',
            'GET',
            { fields: 'email,first_name,last_name,picture' },
            (fbres) => {
              let user = {
                first_name: fbres.first_name,
                last_name: fbres.last_name ? fbres.last_name : '',
                email: fbres.email,
                password: 'facebook',
                avatar: fbres.picture.data.url ? fbres.picture.data.url : null,
                is_active: 1,
              };

              this.trainerhttp
                .PostAPI('trainer/social_login', user)
                .then((resdata: any) => {
                  localStorage.setItem('Trainer', JSON.stringify(resdata.data));
                  localStorage.setItem(
                    'TrainerToken',
                    JSON.stringify(resdata.TrainerToken)
                  );
                  this.trainerhttp.IsTrainerLogin = true;
                  this.trainerhttp.TrainerToken = resdata.TrainerToken;
                  this.toastr.success(resdata.message);
                  this.router.navigate(['/trainer/my-account']);
                })
                .catch((err) => {
                  this.toastr.error(err);
                });
            }
          );
        } else {
          this.toastr.error('User login failed');
        }
      },
      { scope: 'email', return_scopes: true }
    );
  }

  prepareLogin() {
    this.auth2.attachClickHandler(
      this.loginElement.nativeElement,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        let user = {
          first_name: profile.getGivenName(),
          last_name: profile.getFamilyName() ? profile.getFamilyName() : '',
          email: profile.getEmail(),
          password: 'google',
          avatar: profile.getImageUrl() ? profile.getImageUrl() : null,
          is_active: 1,
        };
        this.trainerhttp
          .PostAPI('trainer/social_login', user)
          .then((resdata: any) => {
            if (resdata.status === 200) {
              localStorage.setItem('Trainer', JSON.stringify(resdata.data));
              localStorage.setItem(
                'TrainerToken',
                JSON.stringify(resdata.TrainerToken)
              );
              this.trainerhttp.IsTrainerLogin = true;
              this.trainerhttp.TrainerToken = resdata.TrainerToken;
              this.toastr.success(resdata.message);
              this.router.navigate(['/trainer/my-account']);
            } else {
              this.toastr.error(resdata.message);
            }
          })
          .catch((err) => {
            this.toastr.error(err);
          });
      },
      (error) => {
        this.toastr.error('User login failed');
        console.log(error);
      }
    );
  }

  get fval() {
    return this.AddForm.controls;
  }

  onSubmitForm() {
    this.form_submitted = true;
    if (this.AddForm.invalid) {
      return;
    }
    var data = this.AddForm.value;
    this.trainerhttp
      .PostAPI('trainer/login', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          localStorage.setItem('Trainer', JSON.stringify(resdata.data));
          localStorage.setItem('TrainerToken', resdata.TrainerToken);
          this.trainerhttp.IsTrainerLogin = true;
          this.trainerhttp.TrainerToken = resdata.TrainerToken;
          this.toastr.success(resdata.message);
          this.router.navigate(['/trainer/my-account']);
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }
}
