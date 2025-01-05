import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  constructor(private userService: UserService, private translate: TranslateService) {}

  setUserLanguage(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.userService.getUserInfo(user.id).subscribe({
            next: (userInfo) => {
              if (userInfo && userInfo.language) {
                this.translate.use(userInfo.language); 
              }
            },
            error: (err) => {
              console.error('Failed to fetch UsersInfo:', err);
            },
          });
        }
      },
      error: (err) => {
        console.error('Failed to fetch current user:', err);
      },
    });
  }
}