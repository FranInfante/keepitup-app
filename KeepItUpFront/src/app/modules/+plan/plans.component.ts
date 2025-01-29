import { Component, OnInit } from '@angular/core';
import { ASSET_URLS, LOCATIONS, TOAST_MSGS } from '../../shared/constants';
import { Plan } from '../../shared/interfaces/plan';
import { User } from '../../shared/interfaces/users';
import { Workout } from '../../shared/interfaces/workout';
import { PlanService } from '../../shared/service/plan.service';
import { ToastService } from '../../shared/service/toast.service';
import { UserService } from '../../shared/service/user.service';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { PlanHeaderComponent } from './components/plan-header/plan-header.component';
import { WorkoutsComponent } from './components/workouts/workouts.component';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './components/tabs/tabs.component';
import { NewPlan } from '../../shared/interfaces/newplan';
import { DeletePlanModalComponent } from './components/delete-plan-modal/delete-plan-modal.component';
import { ThemeService } from '../../shared/service/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-plan-tabs',
  standalone: true,
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.css'],
  imports: [
    BackToMenuComponent,
    PlanHeaderComponent,
    CommonModule,
    WorkoutsComponent,
    TabsComponent,
    DeletePlanModalComponent,
    TranslateModule
  ],
})
export class PlansComponent implements OnInit {
  plans: Plan[] = [];
  activePlanId: number | null = null;
  activePlan: Plan | null = null;
  currentUser: User | null = null;
  user: User | null = null;
  ThreeDotsIcon: string = ASSET_URLS.ThreeDotsIcon;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  PlusSignIcon: string = ASSET_URLS.PlusSignIcon;
  editMode = false;
  isDeleteModalOpen: boolean = false;

  constructor(
    private planService: PlanService,
    private userService: UserService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) {    this.themeService.initializeThemeUserFromLocalStorage();
  }

  ngOnInit(): void {

    const storedActivePlanId = localStorage.getItem('activePlanId');
    if (storedActivePlanId) {
      this.activePlanId = parseInt(storedActivePlanId, 10);
    }
    this.userService.getCurrentUser().subscribe((user) => {
      if (user && user.id) {
        this.user = user;
      }
    });

    this.userService.userSubject.subscribe((user) => {
      if (user && user.id !== undefined) {
        this.currentUser = user;
        this.fetchUserPlans(user.id);
      }
    });

    if (!this.currentUser) {
      this.userService.getCurrentUser().subscribe({
        next: (user: User) => {
          if (user.id !== undefined) {
            this.currentUser = user;
            this.fetchUserPlans(user.id);
          }
        },
      });
    }
  }

  

  fetchUserPlans(userId: number): void {
    this.planService.getPlansByUserId(userId).subscribe((plans) => {
      this.plans = plans.sort((a, b) => a.id - b.id);
      if (this.plans.length > 0) {
        if (
          this.activePlanId &&
          this.plans.some((plan) => plan.id === this.activePlanId)
        ) {
          this.selectPlan(this.activePlanId);
        } else {
          this.selectPlan(this.plans[0].id);
        }
      } else {
        this.activePlan = null;
        this.activePlanId = null;
        localStorage.removeItem('activePlanId');
      }
    });
  }

  selectPlan(id: number): void {
    if (this.editMode) {
      this.editMode = false;
      this.toastService.showToast(TOAST_MSGS.editmodedisabled, 'info');
    }

    this.activePlanId = id;
    localStorage.setItem('activePlanId', id.toString());
    this.resetPlanHeader();

    this.planService.getPlanById(id).subscribe((plan) => {
      this.activePlan = plan ?? null;

      if (this.activePlan) {
        this.updatePlanHeader(this.activePlan.name);
      }
    });
  }

  resetPlanHeader(): void {
    const headerElement = document.querySelector('h3') as HTMLElement;
    if (headerElement) {
      headerElement.innerText = '';
    }
  }

  updatePlanHeader(planName: string): void {
    const headerElement = document.querySelector('h3') as HTMLElement;
    if (headerElement) {
      headerElement.innerText = planName;
    }
  }

  addPlan(): void {
    if (this.currentUser) {
      const newPlan: NewPlan = {
        name: `Plan ${this.plans.length + 1}`,
        userId: this.currentUser.id!,
        workouts: [],
      };

      this.planService.addPlan(newPlan).subscribe((plan) => {
        this.plans.push(plan);
        this.selectPlan(plan.id);
      });
    }
  }

  deletePlan(id: number): void {
    this.planService.deletePlan(id).subscribe(() => {
      this.plans = this.plans.filter((plan) => plan.id !== id);

      if (this.activePlanId === id) {
        if (this.plans.length > 0) {
          this.selectPlan(this.plans[0].id);
        } else {
          this.activePlan = null;
          this.activePlanId = null;
        }
      }
    });
  }
  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.toastService.showToast(TOAST_MSGS.editmode, 'info');
    }
  }
  onPlanNameUpdated(updatedPlan: Plan): void {
    const index = this.plans.findIndex((plan) => plan.id === updatedPlan.id);
    if (index !== -1) {
      this.plans[index].name = updatedPlan.name;
    }
  }
  onWorkoutsUpdated(updatedWorkouts: Workout[]): void {
    if (this.activePlan) {
      this.activePlan.workouts = updatedWorkouts;
    }
  }
  isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleDeleteModal(isOpen: boolean): void {
    this.isDeleteModalOpen = isOpen;
  }
  
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }
  
  onTabClicked(): void {
    const workoutsComponent = document.querySelector('app-workouts');
    if (workoutsComponent) {
      workoutsComponent.dispatchEvent(new CustomEvent('modalClosed'));
    }
  }
}
