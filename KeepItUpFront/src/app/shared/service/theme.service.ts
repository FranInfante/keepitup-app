import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  private themeKey = 'theme';

  constructor(private userService: UserService) {
  }
  initializeTheme(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.userService.getUserInfo(user.id).subscribe({
            next: (userInfo) => {
              if (userInfo?.theme) {
                this.applyTheme(userInfo.theme);
              } else {
                this.applyTheme('dark');
              }
            },
            error: (err) => {
              console.error('Failed to fetch user info:', err);
              this.applyTheme('dark');
            },
          });
        } else {
          this.initializeThemeFromLocalStorage(); // Fallback for unauthenticated users
        }
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
        this.initializeThemeFromLocalStorage(); // Fallback for unauthenticated users
      },
    });
  }

  initializeThemeFromLocalStorage(): void {
    const savedTheme = localStorage.getItem(this.themeKey) || 'dark';
    this.applyTheme(savedTheme);
  }

  private applyTheme(theme: string): void {
    const htmlElement = document.documentElement;

    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  toggleThemeForUnauthenticated(): void {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem(this.themeKey, newTheme);
  }

  toggleTheme(): void {
    const htmlElement = document.documentElement;
    const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';

    if (newTheme === 'light') {
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
    }

    this.updateUserTheme(newTheme); // Updates theme in user info
  }

  private updateUserTheme(theme: string): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.userService.setThemeWithUserId(user.id, theme).subscribe({
            error: (err) => console.error('Failed to update user theme:', err),
          });
        }
      },
      error: (err) => console.error('Failed to fetch current user:', err),
    });
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}