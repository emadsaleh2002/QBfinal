import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { QuestionsComponent } from './questions/questions.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { QuestionDisplayComponent } from './question-display/question-display.component';
import { AdminSubjectsComponent } from './admin-subjects/admin-subjects.component';
import { AdminTopicsComponent } from './admin-topics/admin-topics.component';
import { AdminQuestionsComponent } from './admin-questions/admin-questions.component';
// import { AdminFilesComponent } from './admin-files/admin-files.component';
import { AdminDeletedQuestionComponent } from './admin-deleted-question/admin-deleted-question.component';
import { AuthService } from './auth.service';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: LandingComponent },

  // Public
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // Protected - student & admin
  {
    path: 'questions',
    component: QuestionsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['student', 'admin'] }
  },
  {
    path: 'question-display',
    component: QuestionDisplayComponent,
    canActivate: [RoleGuard],
    data: { roles: ['student', 'admin'] }
  },
  {
    path: 'verify-otp',component: VerifyOtpComponent},
  {
    path: 'reset-password',component: ResetPasswordComponent},

  // Admin-only routes
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/subjects',
    component: AdminSubjectsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/topics',
    component: AdminTopicsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/questions',
    component: AdminQuestionsComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'admin/deleted/question',
    component: AdminDeletedQuestionComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin'] }
  },

  // Fallback
  { path: '**', redirectTo: '/home', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
