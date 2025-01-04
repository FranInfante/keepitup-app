import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'theme';

  constructor() {
    this.initializeTheme();
  }

  initializeTheme(): void {
    const theme = localStorage.getItem(this.THEME_KEY) || 'dark';
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const htmlElement = document.documentElement;

    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem(this.THEME_KEY, 'light');
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem(this.THEME_KEY, 'dark');
    }
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
