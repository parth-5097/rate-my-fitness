import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SocialloginserviceService {
  url;
  constructor(private http: HttpClient) {}

  saveResponse(response) {
    this.url = 'http://localhost:4200/api/login/saveresponse';
    return this.http.post(this.url, response);
  }
}
