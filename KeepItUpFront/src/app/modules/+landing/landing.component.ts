import { Component, HostListener } from '@angular/core';
import { ASSET_URLS, LOCATIONS } from '../../shared/constants';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  bg: string = ASSET_URLS.backgroudnd;
  target: string = ASSET_URLS.target;
  tools: string = ASSET_URLS.tools;
  weight: string = ASSET_URLS.weight;
  logworkouts: string = ASSET_URLS.logworkouts;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  currentSection: string = ''; // Holds the currently active section ID
  
  constructor(private translate: TranslateService){};
  
  // Listen to window scroll events
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.updateActiveSection();
  }

  // Method to determine and update the active section
  updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const offset = 200; // Adjust offset for the navbar height
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

  // Add 'text-blue-500' and 'font-bold' to the active link
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
    localStorage.setItem('language', lang);
  }
}
