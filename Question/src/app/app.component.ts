import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ThemeService } from './theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Question';

  constructor(
    public router: Router,
    public authService: AuthService,
    public themeService: ThemeService
  ) {}

  ngOnInit() {
    // Apply saved dark mode setting on app load
    this.themeService.setDarkMode(this.themeService.isDarkMode());
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  isQuestionsPage(): boolean {
    return this.router.url === '/questions' || this.router.url === '/question-display';
  }

  isQuestion(): boolean {
    return location.pathname.includes('/questions');
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
  reloadPage() {
    // window.location.reload();
    window.location.href = '/home';
  }

  logout() {
    localStorage.removeItem('email');
    this.router.navigate(['/home']);
    this.authService.loginCase=false;
  }

}
