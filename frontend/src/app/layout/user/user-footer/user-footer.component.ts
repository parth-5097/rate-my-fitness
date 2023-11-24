import { Component, OnInit } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrls: ['./user-footer.component.css']
})
export class UserFooterComponent implements OnInit {

  constructor(public router: Router, private toastr: ToastrService){}

  ngOnInit(): void {
  }

}
