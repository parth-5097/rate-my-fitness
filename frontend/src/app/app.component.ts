import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AdminhttpService } from './service/adminhttp.service';
import { HttpService } from './service/http.service';
import { TrainerHttpService } from './service/trainer-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public adminhttp: AdminhttpService,
    public http: HttpService,
    public trainerhttp: TrainerHttpService
  ) {}

  ngOnInit(): void {
    var AdminToken = localStorage.getItem('AdminToken');
    if (AdminToken && AdminToken != '') {
      this.adminhttp.Admintoken = AdminToken;
    }
    var objAdmin = localStorage.getItem('AdminUser');
    if (objAdmin) {
      this.adminhttp.IsAdminLogin = true;
    }

    var Token = localStorage.getItem('Token');
    if (Token && Token != '') {
      this.http.token = Token;
    }
    var objUser = localStorage.getItem('User');
    if (objUser) {
      this.http.IsUserLogin = true;
    }

    var TrainerToken = localStorage.getItem('TrainerToken');
    if (TrainerToken && TrainerToken != '') {
      this.trainerhttp.TrainerToken = TrainerToken;
    }
    var objTrainer = localStorage.getItem('Trainer');
    if (objTrainer) {
      this.trainerhttp.IsTrainerLogin = true;
    }

    const appTitle = this.titleService.getTitle();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          const child = this.activatedRoute.firstChild;
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      )
      .subscribe((ttl: string) => {
        this.titleService.setTitle(ttl);
      });
  }
}
