import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeService } from '../theme.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  constructor(private router: Router,private themeService: ThemeService) { }
  isDarkMode = false;
  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }

  goToTopics() {
    this.router.navigate(['/admin/topics']); // توجيه المستخدم إلى صفحة المواضيع
  }
  goToQuestions() {
    this.router.navigate(['/admin/questions']);
  }
  goToSubjects() {
    this.router.navigate(['/admin/subjects']);
  }
  // view() {
  //   this.router.navigate(['/admin/files']);
  // }
}
