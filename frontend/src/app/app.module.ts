import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';
import { AppComponent } from './app.component';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { TrainerLoginComponent } from './auth/trainer-login/trainer-login.component';
import { AdminGuestGuardService } from './service/admin-guest-guard.service';
import { AdminAuthGuradService } from './service/admin-auth-gurad.service';
import { GuestGuardService } from './service/guest-guard.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminHeaderComponent } from './layout/admin/admin-header/admin-header.component';
import { AdminSidebarComponent } from './layout/admin/admin-sidebar/admin-sidebar.component';
import { AdminFooterComponent } from './layout/admin/admin-footer/admin-footer.component';
import { AdminGymComponent } from './admin/admin-gym/admin-gym.component';
import { AdminTrainersComponent } from './admin/admin-trainers/admin-trainers.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminBlogsComponent } from './admin/admin-blogs/admin-blogs.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { UserSignupComponent } from './auth/user-signup/user-signup.component';
import { UserHeaderComponent } from './layout/user/user-header/user-header.component';
import { UserFooterComponent } from './layout/user/user-footer/user-footer.component';
import { SearchTrainerComponent } from './user/search-trainer/search-trainer.component';
import { TrainerComponent } from './user/trainer/trainer.component';
import { AboutUsComponent } from './user/about-us/about-us.component';
import { BlogComponent } from './user/blog/blog.component';
import { ContactUsComponent } from './user/contact-us/contact-us.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { FaqComponent } from './user/faq/faq.component';
import { FindGymComponent } from './user/find-gym/find-gym.component';
import { FindMyTrainerComponent } from './user/find-my-trainer/find-my-trainer.component';
import { GymTopRateComponent } from './user/gym-top-rate/gym-top-rate.component';
import { MyAccountComponent } from './user/my-account/my-account.component';
import { RateThisGymComponent } from './user/rate-this-gym/rate-this-gym.component';
import { RateTrainerComponent } from './user/rate-trainer/rate-trainer.component';
import { ViewAllInstructorsComponent } from './user/view-all-instructors/view-all-instructors.component';
import { ViewRatingComponent } from './user/view-rating/view-rating.component';
import { HomeComponent } from './user/home/home.component';
import { AdminEditProfileComponent } from './admin/admin-edit-profile/admin-edit-profile.component';
import { AdminForgotPasswordComponent } from './auth/admin-forgot-password/admin-forgot-password.component';
import { DataTablesModule } from 'angular-datatables';
import { AddUserComponent } from './admin/admin-users/add-user/add-user.component';
import { EditUserComponent } from './admin/admin-users/edit-user/edit-user.component';
import { AddGymComponent } from './admin/admin-gym/add-gym/add-gym.component';
import { EditGymComponent } from './admin/admin-gym/edit-gym/edit-gym.component';
import { ViewGymComponent } from './admin/admin-gym/view-gym/view-gym.component';
import { AddTrainerComponent } from './admin/admin-trainers/add-trainer/add-trainer.component';
import { EditTrainerComponent } from './admin/admin-trainers/edit-trainer/edit-trainer.component';
import { ViewTrainerComponent } from './admin/admin-trainers/view-trainer/view-trainer.component';
import { AddBlogComponent } from './admin/admin-blogs/add-blog/add-blog.component';
import { EditBlogComponent } from './admin/admin-blogs/edit-blog/edit-blog.component';
import { ViewBlogComponent } from './admin/admin-blogs/view-blog/view-blog.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { UserForgotPasswordComponent } from './auth/user-forgot-password/user-forgot-password.component';
import { UserPersonalIfoComponent } from './user/user-personal-ifo/user-personal-ifo.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgSelect2Module } from 'ng-select2';
import { BlogDetailsComponent } from './user/blog/blog-details/blog-details.component';
import { TrainerMyAccountComponent } from './trainer/trainer-my-account/trainer-my-account.component';
import { TrainerFooterComponent } from './layout/trainer/trainer-footer/trainer-footer.component';
import { TrainerHeaderComponent } from './layout/trainer/trainer-header/trainer-header.component';
import { TrainerGuestGuardService } from './service/trainer-guest-guard.service';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ViewUserComponent } from './admin/admin-users/view-user/view-user.component';
import { TrainerProfileComponent } from './user/trainer-profile/trainer-profile.component';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    AdminLoginComponent,
    UserLoginComponent,
    TrainerLoginComponent,
    AdminDashboardComponent,
    AdminHeaderComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    AdminGymComponent,
    AdminTrainersComponent,
    AdminUsersComponent,
    AdminBlogsComponent,
    AdminProfileComponent,
    UserSignupComponent,
    UserHeaderComponent,
    UserFooterComponent,
    SearchTrainerComponent,
    TrainerComponent,
    AboutUsComponent,
    BlogComponent,
    ContactUsComponent,
    EditProfileComponent,
    FaqComponent,
    FindGymComponent,
    FindMyTrainerComponent,
    GymTopRateComponent,
    MyAccountComponent,
    RateThisGymComponent,
    RateTrainerComponent,
    ViewAllInstructorsComponent,
    ViewRatingComponent,
    HomeComponent,
    AdminEditProfileComponent,
    AdminForgotPasswordComponent,
    AddUserComponent,
    EditUserComponent,
    AddGymComponent,
    EditGymComponent,
    ViewGymComponent,
    AddTrainerComponent,
    EditTrainerComponent,
    ViewTrainerComponent,
    AddBlogComponent,
    EditBlogComponent,
    ViewBlogComponent,
    UserForgotPasswordComponent,
    UserPersonalIfoComponent,
    VerifyAccountComponent,
    BlogDetailsComponent,
    TrainerMyAccountComponent,
    TrainerFooterComponent,
    TrainerHeaderComponent,
    ViewUserComponent,
    TrainerProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    SlickCarouselModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgSelect2Module,
    NgApexchartsModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    DatePipe,
    AdminGuestGuardService,
    AdminAuthGuradService,
    GuestGuardService,
    TrainerGuestGuardService,
    Title,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
