import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../theme.service';
@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  isDarkMode: boolean = false;
  constructor(private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.darkMode$.subscribe(mode => {
      this.isDarkMode = mode;
    });
  }
}
