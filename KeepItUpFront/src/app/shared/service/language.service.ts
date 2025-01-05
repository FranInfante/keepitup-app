import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private _languageLoaded = new BehaviorSubject<boolean>(false);
  languageLoaded$ = this._languageLoaded.asObservable();

  constructor(
    private userService: UserService,
    private translate: TranslateService
  ) {}

  setUserLanguage(): void {
    const savedLanguage = localStorage.getItem('userLanguage');
    if (savedLanguage) {
      this.translate.use(savedLanguage);
      this._languageLoaded.next(true);
    } else {
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          if (user && user.id) {
            this.userService.getUserInfo(user.id).subscribe({
              next: (userInfo) => {
                const language = userInfo?.language || 'en';
                this.applyLanguage(language);
              },
              error: (err) => {
                console.error('Failed to fetch user info:', err);
                this.applyLanguage('en');
              },
            });
          } else {
            this.applyLanguage('en');
          }
        },
        error: (err) => {
          console.error('Failed to fetch current user:', err);
          this.applyLanguage('en');
        },
      });
    }
  }

  private applyLanguage(language: string): void {
    this.translate.use(language);
    localStorage.setItem('userLanguage', language);
    this._languageLoaded.next(true);
  }
}
