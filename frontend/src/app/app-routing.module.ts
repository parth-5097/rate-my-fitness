import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLoginComponent } from './auth/admin-login/admin-login.component';
import { AdminGuestGuardService } from './service/admin-guest-guard.service';
import { GuestGuardService } from './service/guest-guard.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGymComponent } from './admin/admin-gym/admin-gym.component';
import { AdminTrainersComponent } from './admin/admin-trainers/admin-trainers.component';
import { AdminUsersComponent } from './admin/admin-users/admin-users.component';
import { AdminBlogsComponent } from './admin/admin-blogs/admin-blogs.component';
import { AdminProfileComponent } from './admin/admin-profile/admin-profile.component';
import { AdminAuthGuradService } from './service/admin-auth-gurad.service';
import { UserLoginComponent } from './auth/user-login/user-login.component';
import { UserSignupComponent } from './auth/user-signup/user-signup.component';
import { AboutUsComponent } from './user/about-us/about-us.component';
import { ContactUsComponent } from './user/contact-us/contact-us.component';
import { BlogComponent } from './user/blog/blog.component';
import { FaqComponent } from './user/faq/faq.component';
import { FindGymComponent } from './user/find-gym/find-gym.component';
import { EditProfileComponent } from './user/edit-profile/edit-profile.component';
import { FindMyTrainerComponent } from './user/find-my-trainer/find-my-trainer.component';
import { GymTopRateComponent } from './user/gym-top-rate/gym-top-rate.component';
import { MyAccountComponent } from './user/my-account/my-account.component';
import { RateThisGymComponent } from './user/rate-this-gym/rate-this-gym.component';
import { RateTrainerComponent } from './user/rate-trainer/rate-trainer.component';
import { SearchTrainerComponent } from './user/search-trainer/search-trainer.component';
import { TrainerComponent } from './user/trainer/trainer.component';
import { ViewAllInstructorsComponent } from './user/view-all-instructors/view-all-instructors.component';
import { ViewRatingComponent } from './user/view-rating/view-rating.component';
import { HomeComponent } from './user/home/home.component';
import { AdminEditProfileComponent } from './admin/admin-edit-profile/admin-edit-profile.component';
import { AdminForgotPasswordComponent } from './auth/admin-forgot-password/admin-forgot-password.component';
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
import { UserForgotPasswordComponent } from './auth/user-forgot-password/user-forgot-password.component';
import { AuthGuardService } from './service/auth-guard.service';
import { UserPersonalIfoComponent } from './user/user-personal-ifo/user-personal-ifo.component';
import { VerifyAccountComponent } from './auth/verify-account/verify-account.component';
import { BlogDetailsComponent } from './user/blog/blog-details/blog-details.component';
import { TrainerAuthGuardService } from './service/trainer-auth-guard.service';
import { TrainerLoginComponent } from './auth/trainer-login/trainer-login.component';
import { TrainerGuestGuardService } from './service/trainer-guest-guard.service';
import { TrainerMyAccountComponent } from './trainer/trainer-my-account/trainer-my-account.component';
import { ViewUserComponent } from './admin/admin-users/view-user/view-user.component';
import { TrainerProfileComponent } from './user/trainer-profile/trainer-profile.component';

const routes: Routes = [
  {
    path: 'admin',
    pathMatch: 'prefix',
    redirectTo: 'admin/login',
    canActivate: [AdminGuestGuardService],
    data: { title: 'Rate My Fitness - Admin Login' },
  },
  {
    path: 'admin/login',
    component: AdminLoginComponent,
    canActivate: [AdminGuestGuardService],
    data: { title: 'Rate My Fitness - Admin Login' },
  },
  {
    path: 'admin/forgot-password',
    component: AdminForgotPasswordComponent,
    canActivate: [AdminGuestGuardService],
    data: { title: 'Rate My Fitness - Admin Forgot Password' },
  },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Dashboard' },
  },
  {
    path: 'admin/gym',
    component: AdminGymComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Gym' },
  },
  {
    path: 'admin/gym/add-gym',
    component: AddGymComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Add Gym' },
  },
  {
    path: 'admin/gym/edit-gym/:id',
    component: EditGymComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Edit Gym' },
  },
  {
    path: 'admin/gym/view-gym/:id',
    component: ViewGymComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin View Gym' },
  },
  {
    path: 'admin/trainers',
    component: AdminTrainersComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Trainers' },
  },
  {
    path: 'admin/trainers/add-trainer',
    component: AddTrainerComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Add Trainers' },
  },
  {
    path: 'admin/trainers/edit-trainer/:id',
    component: EditTrainerComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Edit Trainers' },
  },
  {
    path: 'admin/trainers/view-trainer/:id',
    component: ViewTrainerComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin View Trainers' },
  },
  {
    path: 'admin/users',
    component: AdminUsersComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Users' },
  },
  {
    path: 'admin/users/add-user',
    component: AddUserComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Add Users' },
  },
  {
    path: 'admin/users/edit-user/:id',
    component: EditUserComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Edit Users' },
  },
  {
    path: 'admin/users/view-user/:id',
    component: ViewUserComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin View Users' },
  },
  {
    path: 'admin/blogs',
    component: AdminBlogsComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Blogs' },
  },
  {
    path: 'admin/blogs/add-blog',
    component: AddBlogComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Add Blogs' },
  },
  {
    path: 'admin/blogs/edit-blog/:id',
    component: EditBlogComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Edit Blogs' },
  },
  {
    path: 'admin/blogs/view-blog/:id',
    component: ViewBlogComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin View Blogs' },
  },
  {
    path: 'admin/profile',
    component: AdminProfileComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Profile' },
  },
  {
    path: 'admin/edit-profile',
    component: AdminEditProfileComponent,
    canActivate: [AdminAuthGuradService],
    data: { title: 'Rate My Fitness - Admin Edit Profile' },
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
    canActivate: [GuestGuardService],
    data: { title: 'Rate My Fitness' },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { title: 'Rate My Fitness' },
  },
  {
    path: 'login',
    component: UserLoginComponent,
    canActivate: [GuestGuardService],
    data: { title: 'Rate My Fitness - User login' },
  },
  {
    path: 'signup',
    component: UserSignupComponent,
    canActivate: [GuestGuardService],
    data: { title: 'Rate My Fitness - User signup' },
  },
  {
    path: 'verify-account/:email',
    component: VerifyAccountComponent,
    data: { title: 'Rate My Fitness - Verify account' },
  },
  {
    path: 'forgot-password',
    component: UserForgotPasswordComponent,
    canActivate: [GuestGuardService],
    data: { title: 'Rate My Fitness - Forgot password' },
  },
  {
    path: 'trainers',
    component: TrainerComponent,
    data: { title: 'Rate My Fitness - Trainers' },
  },
  {
    path: 'about-us',
    component: AboutUsComponent,
    data: { title: 'Rate My Fitness - About-us' },
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    data: { title: 'Rate My Fitness - Contact-us' },
  },
  {
    path: 'blog',
    component: BlogComponent,
    data: { title: 'Rate My Fitness - Blog' },
  },
  {
    path: 'blog-details/:blog_id',
    component: BlogDetailsComponent,
    data: { title: 'Rate My Fitness' },
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: { title: 'Rate My Fitness - Blog-details' },
  },

  {
    path: 'my-account',
    component: MyAccountComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - My account' },
  },
  {
    path: 'personal-info',
    component: UserPersonalIfoComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Personal information' },
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Edit profile' },
  },
  {
    path: 'find-gym',
    component: FindGymComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Find gym' },
  },
  {
    path: 'find-my-trainer',
    component: FindMyTrainerComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Find my Trainer' },
  },
  {
    path: 'gym-top-rate',
    component: GymTopRateComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Gym top Rate' },
  },
  {
    path: 'rate-this-gym',
    component: RateThisGymComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Rate this Gym' },
  },
  {
    path: 'rate-trainer/:trainer_id',
    component: RateTrainerComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Rate trainer' },
  },
  {
    path: 'trainer-profile/:trainer_id',
    component: TrainerProfileComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - trainer profile' },
  },
  {
    path: 'search-trainer',
    component: SearchTrainerComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - Search trainer' },
  },
  {
    path: 'view-all-instructors',
    component: ViewAllInstructorsComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - View all instructors' },
  },
  {
    path: 'view-rating',
    component: ViewRatingComponent,
    canActivate: [AuthGuardService],
    data: { title: 'Rate My Fitness - View rating' },
  },

  {
    path: 'trainer',
    component: TrainerLoginComponent,
    canActivate: [TrainerGuestGuardService],
    data: { title: 'Rate My Fitness' },
  },
  {
    path: 'trainer/login',
    component: TrainerLoginComponent,
    canActivate: [TrainerGuestGuardService],
    data: { title: 'Rate My Fitness' },
  },
  {
    path: 'trainer/my-account',
    component: TrainerMyAccountComponent,
    canActivate: [TrainerAuthGuardService],
    data: { title: 'Rate My Fitness' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
