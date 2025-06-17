import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  toastMessage: string = '';
  isDarkMode = false;
  isLoading = false;


  users = [
    { email: 'john@example.com', password: '1234' },
    { email: 'emadsara1511@gmail.com', password: '1234' },
    { email: 'alice@example.com', password: 'abcd' }
  ];

  constructor(private fb: FormBuilder, private router: Router,private themeService: ThemeService , private http:HttpClient , private authservice :AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendOTP() {
    const email = this.forgotForm.value.email;
    console.log(email);

    if (!email) {
    console.log("Email is required");
    this.toastMessage="Email is required";
     this.autoClearMessage();
    return;
  }

   this.isLoading = true; // 🔒 تعطيل الزر
   const body = { email };

   this.http.post(`${this.authservice.baseUrl}/api/auth/forgot-password`, body)
    .subscribe({
      next: (res: any) => {
        if (res.success) {
          this.toastMessage = "✅" + res.message +" successfully:"; // otp send to your email
          localStorage.setItem('emailForVerification', email);  // ⬅️ تخزين الإيميل
          setTimeout(() => {
            this.router.navigate(['/verify-otp']);
          }, 2000);
        } else {
          this.toastMessage = "❌ this email not exist";
        }
         this.autoClearMessage();
         this.isLoading = false; // 🔓 تفعيل الزر
      },
      error: (err) => {
        this.toastMessage = err.error?.error || "Something went wrong. Please try again.";
        console.error("❌ Error sending OTP:", err);
         this.autoClearMessage();
         this.isLoading = false; // 🔓 تفعيل الزر
      }
    });

  }

  autoClearMessage() {
  setTimeout(() => {
    this.toastMessage = '';
  }, 5000);
  }


  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
