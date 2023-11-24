import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class GuestGuardService implements CanActivate {

  constructor(public router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('Token');
    if (token) {
      this.router.navigate(['/my-account']);
      return false;
    }
    return true;
  }

}
