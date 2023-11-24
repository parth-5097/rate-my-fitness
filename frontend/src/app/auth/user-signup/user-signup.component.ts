import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, CanActivate } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../service/http.service';
import { ConfirmedValidator } from '../../confirmed.validator';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css'],
})
export class UserSignupComponent implements OnInit {
  form_submitted = false;
  AddForm: FormGroup;

  trainer_form_submitted = false;
  AddTrainerForm: FormGroup;

  constructor(
    public router: Router,
    public toastr: ToastrService,
    public http: HttpService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.VerifyForm();
    this.VerifyTrainerForm();
  }

  VerifyForm() {
    this.AddForm = this.formBuilder.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        newpassword: ['', [Validators.required, Validators.minLength(6)]],
        retypepassword: ['', [Validators.required, Validators.minLength(6)]],
      },
      {
        validator: ConfirmedValidator('newpassword', 'retypepassword'),
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
    data['role_id'] = 2;
    this.http
      .PostAPI('user/sign-up', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          this.toastr.success(resdata.message);
          this.router.navigate(['login']);
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }

  VerifyTrainerForm() {
    this.AddTrainerForm = this.formBuilder.group(
      {
        first_name: ['', [Validators.required]],
        last_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        newpassword: ['', [Validators.required, Validators.minLength(6)]],
        retypepassword: ['', [Validators.required, Validators.minLength(6)]],
        socialUrl: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
            ),
          ],
        ],
      },
      {
        validator: ConfirmedValidator('newpassword', 'retypepassword'),
      }
    );
  }

  get fval1() {
    return this.AddTrainerForm.controls;
  }

  onSubmitTrainerForm() {
    this.trainer_form_submitted = true;
    if (this.AddTrainerForm.invalid) {
      return;
    }
    var data = this.AddTrainerForm.value;
    this.http
      .PostAPI('trainer/sign-up', data)
      .then((resdata: any) => {
        if (resdata.status == 200) {
          this.toastr.success(resdata.message);
          this.router.navigate(['trainer/login']);
        } else {
          this.toastr.error(resdata.message);
        }
      })
      .catch((err) => {
        this.toastr.error(err);
      });
  }
}
