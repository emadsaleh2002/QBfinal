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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: LandingComponent },
  { path: 'home', component: HomeComponent },
  { path: 'questions', component: QuestionsComponent  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  {path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'question-display', component: QuestionDisplayComponent },
  { path: 'admin/subjects', component: AdminSubjectsComponent},
  { path: 'admin/topics', component: AdminTopicsComponent },
  { path: 'admin/questions', component: AdminQuestionsComponent },
  // { path: 'admin/files', component: AdminFilesComponent },
  { path: 'admin/deleted/question', component: AdminDeletedQuestionComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
