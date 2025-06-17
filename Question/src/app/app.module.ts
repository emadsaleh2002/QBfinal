import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { QuestionsComponent } from './questions/questions.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { QuestionDisplayComponent } from './question-display/question-display.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminSubjectsComponent } from './admin-subjects/admin-subjects.component';
import { AdminTopicsComponent } from './admin-topics/admin-topics.component';
import { AdminQuestionsComponent } from './admin-questions/admin-questions.component';
// import { AdminFilesComponent } from './admin-files/admin-files.component';
import { AdminDeletedQuestionComponent } from './admin-deleted-question/admin-deleted-question.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionsComponent,
    LandingComponent,
    LoginComponent,
    SignupComponent,
    FooterComponent,
    ForgotPasswordComponent,
    QuestionDisplayComponent,
    AdminDashboardComponent,
    AdminSubjectsComponent,
    AdminTopicsComponent,
    AdminQuestionsComponent,
    // AdminFilesComponent,
    AdminDeletedQuestionComponent,
    VerifyOtpComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule ,
    NgCircleProgressModule.forRoot({}),
    NgSelectModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
