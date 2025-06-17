import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  

  constructor(private router: Router ,private authservice:AuthService ) {}

  goToQuestions() {
    this.router.navigate(['/questions']); // Redirects to the questions page
  }
 
  startNow(): void {
  if (!this.authservice.loginCase) {
    this.router.navigate(['/login']);
  } else if (this.authservice.userRole === 'admin') {
    this.router.navigate(['/admin/dashboard']);
  } else {
    this.router.navigate(['/questions']);
  }
}
}
