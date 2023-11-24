import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuradService implements CanActivate {
  constructor(public router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('AdminToken');
    if (!token) {
      this.router.navigate(['admin/login']);
      return false;
    }
    return true;
  }

}
