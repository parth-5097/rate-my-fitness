import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TrainerHttpService {
  TrainerToken = '';
  IsTrainerLogin = false;
  backendurl = environment.root_url;
  frontendurl = environment.frontend_url;

  constructor(public http: HttpClient, public router: Router) {}

  GetAPI(path, data: any) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.TrainerToken,
      });
      this.http
        .get(environment.root_url + path, { headers: headers, params: data })
        .subscribe(
          (resdata: any) => {
            resolve(resdata);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  PostAPI(path, data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.TrainerToken,
      });
      this.http
        .post(environment.root_url + path, data, { headers: headers })
        .subscribe(
          (resdata: any) => {
            resolve(resdata);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  PutAPI(path, data) {
    return new Promise((resolve, reject) => {
      let headers = new HttpHeaders({
        Authorization: 'Bearer ' + this.TrainerToken,
      });
      this.http
        .put(environment.root_url + path, data, { headers: headers })
        .subscribe(
          (resdata: any) => {
            resolve(resdata);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
  async downloadfile(path, data) {
    const file = await this.http
      .post<Blob>(environment.root_url + path, data, {
        headers: new HttpHeaders().set(
          'authorization',
          'Bearer ' + this.TrainerToken
        ),
        responseType: 'blob' as 'json',
      })
      .toPromise();
    return file;
  }
  Logout() {
    localStorage.removeItem('Trainer');
    localStorage.removeItem('TrainerToken');
    this.TrainerToken = '';
    this.IsTrainerLogin = false;
    this.router.navigate(['/trainer/login']);
  }
}
