import { Component, HostListener, OnInit } from '@angular/core';
import { ASSET_URLS, LOCATIONS } from '../../shared/constants';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/components/lang-modal/lang-modal.component';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../shared/service/theme.service';
import { LanguageService } from '../../shared/service/language.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    RouterModule,
    TranslateModule,
    LanguageSwitcherComponent,
    CommonModule,
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent implements OnInit {
  
  gmailicon: string = ASSET_URLS.gmailicon;
  linkedinicon: string = ASSET_URLS.linkedinicon;
  bg: string = ASSET_URLS.background;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;
  showLanguageModal: boolean = false;
  currentSection: string = '';
  isDark: boolean = false;
  sun: string = ASSET_URLS.sun;
  moon: string = ASSET_URLS.moon;
  isNavbarHidden: boolean = false;

  private lastScrollTop: number = 0;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService
  ) {
    this.languageService.initializeLanguage();
  }

 
  ngOnInit(): void {

    this.isDark = localStorage.getItem('themeUser') === 'dark';
    this.applyTheme(localStorage.getItem('themeUser') || 'dark');
    
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > this.lastScrollTop) {
      // Scrolling down
      this.isNavbarHidden = true;
    } else {
      // Scrolling up
      this.isNavbarHidden = false;
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Avoid negative scroll values
    this.updateActiveSection();
  }

  toggleLanguageModal() {
    this.showLanguageModal = !this.showLanguageModal;
  }

  updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const offset = 200;
    let activeSection = '';

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const scrollPosition = window.scrollY + offset;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        activeSection = section.getAttribute('id') || '';
      }
    });

    this.currentSection = activeSection;
    this.highlightActiveLink();
  }

  highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link) => {
      link.classList.remove('font-bold');
      if (link.getAttribute('href') === `#${this.currentSection}`) {
        link.classList.add('font-bold');
      }
    });
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
  toggleDarkMode() {
    const newTheme = this.isDark ? 'light' : 'dark';
    this.applyTheme(newTheme);
    localStorage.setItem('themeUser', newTheme);
  }
  applyTheme(theme: string) {
    this.isDark = theme === 'dark';
    document.documentElement.classList.toggle('dark', this.isDark);
  }

}
