import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ASSET_URLS, LOCATIONS } from '../../shared/constants';
import { UserService } from '../../shared/service/user.service';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/components/lang-modal/lang-modal.component';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../shared/service/language.service';
import { ThemeService } from '../../shared/service/theme.service';
import { LoadingService } from '../../shared/service/loading.service';
import { combineLatest } from 'rxjs';

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
  themeLoaded = false;
  languageLoaded = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private languageService: LanguageService,
    private themeService: ThemeService,
    private loadingService: LoadingService
  ) {}


  ngOnInit(): void {
    this.loadingService.setLoading(true);
    
    this.themeService.initializeTheme();
    this.languageService.setUserLanguage();

    combineLatest([
      this.themeService.themeLoaded$,
      this.languageService.languageLoaded$,
    ]).subscribe(([themeLoaded, languageLoaded]) => {
      this.themeLoaded = themeLoaded;
      this.languageLoaded = languageLoaded;

      if (themeLoaded && languageLoaded) {
        this.loadingService.setLoading(false);
      }
    });
  }
  navigateToWeighIns() {
    this.router.navigate([LOCATIONS.weighins]);
  }

  navigateToPlans() {
    this.router.navigate([LOCATIONS.plans]);
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
    this.themeService.toggleTheme();
  }

  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
}
