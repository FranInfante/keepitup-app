import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCATIONS } from '../../shared/constants';
import { UserService } from '../../shared/service/user.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../shared/lang-modal/lang-modal.component';
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


  constructor(private router: Router, private userService: UserService, private translate: TranslateService) {}

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
    this.showLanguageModal = !this.showLanguageModal;
  }
}
