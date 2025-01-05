import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private _themeLoaded = new BehaviorSubject<boolean>(false);
  themeLoaded$ = this._themeLoaded.asObservable();

  constructor(private userService: UserService) {}
  initializeTheme(): void {
    const localStorageTheme = localStorage.getItem('themeUser');
    if (localStorageTheme) {
      // If `themeUser` is already in localStorage, apply it directly
      this.applyTheme(localStorageTheme);
      this._themeLoaded.next(true);
    } else {
      // Fetch theme from user API
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          if (user && user.id) {
            this.userService.getUserInfo(user.id).subscribe({
              next: (userInfo) => {
                const theme = userInfo?.theme || 'dark';
                this.applyTheme(theme);
                localStorage.setItem('themeUser', theme);
                this._themeLoaded.next(true);
              },
              error: (err) => {
                console.error('Failed to fetch user info:', err);
                this.applyTheme('dark');
                this._themeLoaded.next(true);
              },
            });
          } else {
            this.initializeThemeFromLocalStorage();
          }
        },
        error: (err) => {
          console.error('Failed to fetch current user:', err);
          this.initializeThemeFromLocalStorage();
        },
      });
    }
  }

  initializeThemeFromLocalStorage(): void {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.applyTheme(savedTheme);
  }
  initializeThemeUserFromLocalStorage(): void {
    const savedThemeUser = localStorage.getItem('themeUser') || 'dark';
    this.applyTheme(savedThemeUser);
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
    const currentTheme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  toggleTheme(): void {
    const htmlElement = document.documentElement;
    const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';

    if (newTheme === 'light') {
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
    }

    this.updateUserTheme(newTheme);
    localStorage.setItem('themeUser', newTheme);
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
