import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.css']
})
export class VerifyOtpComponent implements OnInit {
  otpValues: string[] = Array(6).fill('');
  otpInvalid = false;
  toastMessage = '';
  isDarkMode = false;
  email:string='';
  minutes: number = 10;
  seconds: number = 0;
  interval: any;
  expiredTime:boolean=false;

  constructor(private router: Router,private themeService: ThemeService , private authservice:AuthService , private http:HttpClient) {}

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    // مسح محتوى الحقل يدويًا
    input.value = '';

    if (value.length === 1) {
      this.otpValues[index] = value;

      setTimeout(() => {
        const nextInput = document.getElementById('otp' + (index + 1)) as HTMLInputElement;
        nextInput?.focus();
      }, 0);
    } else if (value.length > 1) {
      const chars = value.split('');
      for (let iOffset = 0; iOffset < chars.length && index + iOffset < 6; iOffset++) {
        this.otpValues[index + iOffset] = chars[iOffset];
        const currentInput = document.getElementById('otp' + (index + iOffset)) as HTMLInputElement;
        if (currentInput) currentInput.value = chars[iOffset];
      }

      setTimeout(() => {
        const nextInput = document.getElementById('otp' + Math.min(index + chars.length, 5)) as HTMLInputElement;
        nextInput?.focus();
      }, 0);
    } else {
      this.otpValues[index] = '';
    }
    
  }


  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace') {
      // لو الخانة الحالية فاضية
      if (input.value === '') {
        if (index > 0) {
          this.otpValues[index - 1] = '';

          // ننتظر لحظة ثم نرجّع الكارسر للخانة السابقة
          setTimeout(() => {
            const prevInput = document.getElementById('otp' + (index - 1)) as HTMLInputElement;
            if (prevInput) {
              prevInput.focus();
              prevInput.value = '';
            }
          }, 0);
        }
      } else {
        // لو الخانة فيها قيمة، امسحها فقط
        this.otpValues[index] = '';
        input.value = '';
      }

      // منع السلوك الافتراضي لتفادي مشاكل التنقل التلقائي
      event.preventDefault();
    }
  }


  verifyOTP() {
    const entered = this.otpValues.join('');
    //const stored = localStorage.getItem('resetOTP');
    console.log(entered);

    // if (entered === stored) {
    //   this.router.navigate(['/reset-password']);
    // } else {
    //   this.otpInvalid = true;
    //   this.toastMessage = 'Invalid OTP!';
    // }

    const body = { email: this.email, otp: entered };
    this.http.post(`${this.authservice.baseUrl}/api/auth/verify-otp`, body)
    .subscribe({
      next: (res) => {
        //console.log('OTP verified successfully', res);
        //alert('Verification successful!');
        this.router.navigate(['/reset-password']);
        // navigate or continue to next step
      },
      error: (err) => {
        console.error('Verification failed', err);
        alert(err.error?.error || 'Verification failed. Please try again.');
      }
    });

  }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
     this.email = localStorage.getItem('emailForVerification')||'';
    console.log('Email from previous page:', this.email);
    this.startCountdown(); // 🔁 بدء العداد
  }

  startCountdown() {
  this.interval = setInterval(() => {
    if (this.seconds === 0) {
      if (this.minutes === 0) {
        clearInterval(this.interval);
        this.toastMessage = '⏱️ OTP expired. Please request a new one.';
        this.expiredTime=true;
        this.otpInvalid = true;
        setTimeout(() => {
            this.router.navigate(['/forgot-password']);
          }, 3000);
      } else {
        this.minutes--;
        this.seconds = 59;
      }
    } else {
      this.seconds--;
    }
  }, 1000);
}


}
