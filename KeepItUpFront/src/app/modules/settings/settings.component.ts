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
import { ThemeModalComponent } from "../../shared/components/theme-modal/theme-modal.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [LanguageSwitcherComponent, TranslateModule, BackToMenuComponent, CommonModule, ThemeModalComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  showLanguageModal = false;
  showThemeModal = false;

  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(
    private router: Router,
    private userService: UserService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {}

  toggleThemeModal() {
    this.showThemeModal = !this.showThemeModal;
  }

  toggleLanguageModal() {
    this.showLanguageModal = !this.showLanguageModal;
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
