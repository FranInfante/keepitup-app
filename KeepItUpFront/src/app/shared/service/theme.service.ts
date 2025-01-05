import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

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
          this.applyTheme('dark'); 
        }
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
        this.applyTheme('dark'); 
      },
    });
  }

  initializeThemeLanding(): void {
    this.applyTheme('dark');            
  }

  private applyTheme(theme: string): void {
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
      this.updateUserTheme('light');
    } else {
      htmlElement.classList.add('dark');
      this.updateUserTheme('dark');
    }
  }

  toggleThemeLanding(): void {
    const htmlElement = document.documentElement;

    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
    } else {
      htmlElement.classList.add('dark');
    }
  }

  private updateUserTheme(theme: string): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.userService.setThemeWithUserId(user.id, theme).subscribe({
            next: () => {
            },
            error: (err) => {
              console.error('Failed to update user theme:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
      },
    });
  }

  isDarkMode(): boolean {
    return document.documentElement.classList.contains('dark');
  }
}
