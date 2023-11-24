import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AdminGuestGuardService implements CanActivate {
  constructor(public router: Router) {}
  canActivate(): boolean {
    const token = localStorage.getItem('AdminToken');
    if (token) {
      this.router.navigate(['admin/dashboard']);
      return false;
    }
    return true;
  }
}
