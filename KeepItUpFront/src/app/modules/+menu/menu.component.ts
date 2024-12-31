import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ASSET_URLS, LOCATIONS } from '../../shared/constants';
import { UserService } from '../../shared/service/user.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/components/lang-modal/lang-modal.component';
import { CommonModule } from '@angular/common';

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
    private translate: TranslateService
  ) {}


  ngOnInit(): void {
    // Fetch the current user to get their ID
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          // Fetch UsersInfo by User ID to get the language
          this.userService.getUserInfo(user.id).subscribe({
            next: (userInfo) => {
              if (userInfo && userInfo.language) {
                this.translate.use(userInfo.language); // Set the translation to the user's language
                localStorage.setItem('language', userInfo.language); // Save it locally for persistence
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
}
