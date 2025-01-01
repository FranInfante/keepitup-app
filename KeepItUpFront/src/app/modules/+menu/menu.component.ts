import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ASSET_URLS, LOCATIONS } from '../../shared/constants';
import { UserService } from '../../shared/service/user.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/components/lang-modal/lang-modal.component';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/service/language.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TranslateModule, LanguageSwitcherComponent, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  LOCATIONS: typeof LOCATIONS = LOCATIONS;
  showLanguageModal = false;
  showDropdown = false;
  gear: string = ASSET_URLS.gear;

  constructor(
    private router: Router,
    private userService: UserService,
    private translate: TranslateService,
    private languageService: LanguageService
  ) {}


  ngOnInit(): void {
    this.languageService.setUserLanguage();
  }
  navigateToWeighIns() {
    this.router.navigate([LOCATIONS.weighins]);
  }

  navigateToWorkouts() {
    this.router.navigate([LOCATIONS.workouts]);
  }

  logout() {
    this.userService.logout();
    this.router.navigate([LOCATIONS.login]);
  }

  toggleLanguageModal() {
    this.showDropdown = false;
    this.showLanguageModal = !this.showLanguageModal;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.dropdown-menu') &&
      !target.closest('.dropdown-button')
    ) {
      this.showDropdown = false;
    }
  }

  toggleDarkMode() {
    const htmlElement = document.documentElement;
    if (htmlElement.classList.contains('dark')) {
      htmlElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      htmlElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
}
