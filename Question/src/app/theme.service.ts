import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkModeSubject = new BehaviorSubject<boolean>(this.loadDarkMode());
  darkMode$ = this.darkModeSubject.asObservable();

  private loadDarkMode(): boolean {
    return localStorage.getItem('darkMode') === 'true';
  }

  toggleDarkMode(): void {
    const newMode = !this.darkModeSubject.value;
    this.setDarkMode(newMode);
  }

  setDarkMode(isDark: boolean): void {
    this.darkModeSubject.next(isDark);
    localStorage.setItem('darkMode', String(isDark));

    // Update body style
    document.body.classList.toggle('dark-mode', isDark);
    document.body.style.backgroundColor = isDark ? '#121212' : '#ffffff';
    document.body.style.color = isDark ? '#ffffff' : '#000000';
  }

  isDarkMode(): boolean {
    return this.darkModeSubject.value;
  }
}
