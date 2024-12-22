import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LOCATIONS } from '../../shared/constants';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(private router: Router, private userService: UserService) {}

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
}
