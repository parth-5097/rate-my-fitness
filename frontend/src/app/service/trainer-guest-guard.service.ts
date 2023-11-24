import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TrainerGuestGuardService implements CanActivate{

  constructor(public router: Router) {}
  canActivate(): boolean {
    const TrainerToken = localStorage.getItem('TrainerToken');
    if (TrainerToken) {
      this.router.navigate(['/trainer/my-account']);
      return false;
    }
    return true;
  }
}
