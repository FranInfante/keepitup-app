import { Component, OnInit } from '@angular/core';
import { GymService } from '../../shared/service/gym.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { LOCATIONS, TOAST_MSGS } from '../../shared/constants';
import { UserService } from '../../shared/service/user.service';
import { ToastService } from '../../shared/service/toast.service';

@Component({
  selector: 'app-gym-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, BackToMenuComponent],
  templateUrl: './gym-manager.component.html',
  styleUrls: ['./gym-manager.component.css'],
})
export class GymManagerComponent implements OnInit {
  gyms: any[] = [];
  newGymName: string = '';
  currentUserId!: number;

  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  constructor(private gymService: GymService, private userService: UserService, private toastService : ToastService) {}

  ngOnInit(): void {
    // Fetch the current user's ID
    this.userService.getCurrentUser().subscribe((user) => {
      if (user && user.id) {
        this.currentUserId = user.id;
        this.loadGyms();
      }
    });

    // Listen for user changes
    this.userService.userSubject.subscribe((user) => {
      if (user && user.id !== undefined) {
        this.currentUserId = user.id;
        this.loadGyms();
      }
    });
  }

  loadGyms(): void {
    if (!this.currentUserId) return;
    this.gymService.getUserGyms(this.currentUserId).subscribe((gyms) => {
      this.gyms = gyms;
    });
  }

  createGym(): void {
    if (!this.newGymName.trim() || !this.currentUserId) return;
  
    this.gymService.createGym({ userId: this.currentUserId, name: this.newGymName }).subscribe({
      next: () => {
        this.newGymName = '';
        this.loadGyms();
        this.toastService.showToast(TOAST_MSGS.gymcreatedsuccess, "success");
      },
      error: (err) => {
        if (err.status === 409) {
          this.gymService.getUserGyms(this.currentUserId).subscribe((gyms) => {
            if (gyms.length >= 5) {
              // Max gyms limit reached
              this.toastService.showToast(TOAST_MSGS.reachedmaxgyms, "info");
            } else {
              // Gym name already exists
              this.toastService.showToast(TOAST_MSGS.alreadyexistsgymname, "info");
            }
          });
        } else {
          this.toastService.showToast(TOAST_MSGS.errorcreatinggym, "danger");
        }
      }
    });
  }
  
  
  

  deleteGym(gymId: number): void {
    this.gymService.deleteGym(gymId).subscribe(() => 
      this.loadGyms()
    );
  }
}
