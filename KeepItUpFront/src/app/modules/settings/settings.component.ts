import { Component } from '@angular/core';
import { LanguageSwitcherComponent } from '../../shared/components/lang-modal/lang-modal.component';
import { Router } from '@angular/router';
import { UserService } from '../../shared/service/user.service';
import { LanguageService } from '../../shared/service/language.service';
import { ThemeService } from '../../shared/service/theme.service';
import { TranslateModule } from '@ngx-translate/core';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { LOCATIONS } from '../../shared/constants';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [LanguageSwitcherComponent, TranslateModule, BackToMenuComponent, CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  showLanguageModal = false;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(
    private router: Router,
    private userService: UserService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {}

  toggleDarkMode() {
    this.themeService.toggleTheme();
  }

  toggleLanguageModal() {
    this.showLanguageModal = !this.showLanguageModal;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
