import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ASSET_URLS } from '../../constants';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-lang-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './lang-modal.component.html',
  styleUrl: './lang-modal.component.css',
})
export class LanguageSwitcherComponent {
  @Output() closeModal = new EventEmitter<void>();

  spain: string = ASSET_URLS.spain;
  english: string = ASSET_URLS.english;

  constructor(
    private translate: TranslateService,
    private userService: UserService
  ) {}

  switchLanguage(lang: string) {

    const authToken = this.userService.getToken();
    if (authToken) {
      this.userService.getCurrentUser().subscribe({
        next: (user) => {
          if (user && user.id) {
            this.userService.setLanguageWithUserId(user.id, lang).subscribe({
              next: () => {
                this.applyLanguage(lang, true);
              },
              error: (err) => {
                console.error('Error switching language:', err);
              },
            });
          } else {
            console.error('User ID is undefined.');
          }
        },
        error: (err) => {
          console.error('Failed to fetch current user:', err);
        },
      });
    } else {
      this.applyLanguage(lang, false);
    }
  }

  private applyLanguage(lang: string, isAuthenticated: boolean) {
    this.translate.use(lang);
    if (isAuthenticated) {
      localStorage.setItem('userLanguage', lang);
    } else {
      localStorage.setItem('language', lang);
    }
    this.closeModal.emit();
  }
}
