import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ThemeService } from '../theme.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isDarkMode = false;
  sendData:boolean=false;

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  toggleShowConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordConditions = {
    hasLowerCase: false,
    hasUpperCase: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false
  };

  
  constructor(private fb: FormBuilder,private themeService: ThemeService , private http:HttpClient , private authservice:AuthService , private router:Router) {}

  ngOnInit(): void {
    const allowedDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com',
      'sci.asu.edu.eg', 'edu.eg', 'harvard.edu', 'mit.edu',
      'ox.ac.uk', 'stu.uni-heidelberg.de', 'companyname.com',
      'orgname.org', 'gov.eg', 'europa.eu'
    ];
    
    const domainPattern = allowedDomains.map(d => d.replace(/\./g, '\\.')).join('|');
    this.signupForm = this.fb.group({
      // username: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(new RegExp(`^[a-zA-Z0-9._%+-]+@(${domainPattern})$`))

      ]],
      password: ['', [Validators.required, this.passwordStrength.bind(this)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    });
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
  
    if (this.signupForm.invalid) return;
  
    const { email, password } = this.signupForm.value;
  
    const body = {
      email: email,
      password: password,
      role: 'student'         // or 'admin' depending on your use case
    };
    this.sendData=true;
  
    this.http.post(`${this.authservice.baseUrl}/api/auth/register`, body)
      .subscribe({
        next: (response) => {
          console.log('Signup successful:', response);
          alert('Registration successful! Please Check your email for verification');
          this.router.navigate(['/login']);
          // Optionally redirect to login or home
        },
        error: (error) => {
          console.error('Signup failed:', error);
          const backendMessage = error.error?.error;

        if (backendMessage === 'Email already exists') {
          alert('Email already exists');
        } else {
          alert('Registration failed. Please try again.');
        }
        this.sendData = false;
        }
      });

  }

  

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  // تحديث الشروط كل ما المستخدم يكتب في الباسورد
  onPasswordInput(): void {
    const value = this.signupForm.get('password')?.value || '';
    this.passwordConditions = {
      hasLowerCase: /[a-z]/.test(value),
      hasUpperCase: /[A-Z]/.test(value),
      hasNumber: /\d/.test(value),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      minLength: value.length >= 6
    };
  }

  // Validator بسيط يربط التحقق بالتحديث
  passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const isStrong = /[a-z]/.test(value) &&
                     /[A-Z]/.test(value) &&
                     /\d/.test(value) &&
                     /[!@#$%^&*(),.?":{}|<>]/.test(value) &&
                     value.length >= 6;
    return isStrong ? null : { passwordStrength: true };
  }
}
