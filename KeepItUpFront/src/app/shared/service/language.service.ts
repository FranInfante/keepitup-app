import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';
import { MSG } from '../constants';

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
    const authToken = this.userService.getToken();
    if (authToken) {
      const savedUserLanguage = localStorage.getItem('userLanguage');
      if (savedUserLanguage) {
        this.translate.use(savedUserLanguage);
        this._languageLoaded.next(true);
      } else {
        this.userService.getCurrentUser().subscribe({
          next: (user) => {
            if (user && user.id) {
              this.userService.getUserInfo(user.id).subscribe({
                next: (userInfo) => {
                  const language = userInfo?.language || 'en';
                  this.applyLanguage(language, true);
                },
                error: (err) => {
                  console.error('Failed to fetch user info:', err);
                  this.applyLanguage('en', true);
                },
              });
            } else {
              this.applyLanguage('en', true);
            }
          },
          error: (err) => {
            console.error(MSG.errorfetchcurrentuser, err);

            this.applyLanguage('en', true);
          },
        });
      }
    } else {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        this.translate.use(savedLanguage);
        this._languageLoaded.next(true);
      } else {
        this.applyLanguage('en', false);
      }
    }
  }

  private applyLanguage(lang: string, isAuthenticated: boolean): void {
    this.translate.use(lang).subscribe(() => {
      if (isAuthenticated) {
        localStorage.setItem('userLanguage', lang);
      } else {
        localStorage.setItem('language', lang);
      }
      this._languageLoaded.next(true);
    });
  }

   initializeLanguage() {
      const savedLanguage = localStorage.getItem('language') || 'en';
      this.translate.use(savedLanguage);
    }
}
