import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Workout } from '../../shared/interfaces/workout';
import { WorkoutsService } from '../../shared/service/workouts.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/service/user.service';
import { forkJoin, SubscriptionLike } from 'rxjs';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { User } from '../../shared/interfaces/users';
import { LanguageService } from '../../shared/service/language.service';
import { LoadingService } from '../../shared/service/loading.service';
import { ThemeService } from '../../shared/service/theme.service';
import { LOCATIONS } from '../../shared/constants';

@Component({
  selector: 'app-workouts-basic',
  standalone: true,
  imports: [
    BackToMenuComponent,
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './workoutsbasic.component.html',
  styleUrl: './workoutsbasic.component.css',
})
export class WorkoutsBasicComponent implements OnInit {
  workoutForm!: FormGroup;
  workoutLogs: Workout[] = [];
  totalWorkouts: number = 0;
  showForm: boolean = false;
  subscriptions: SubscriptionLike[] = [];
  userId: number = 0;
  user: User | null = null;
  workoutToDeleteId?: number;
  showDeleteModal: boolean = false;
  workoutNames: string[] = [];
    LOCATIONS: typeof LOCATIONS = LOCATIONS;
  

  constructor(
    private fb: FormBuilder,
    private workoutService: WorkoutsService,
    private loadingService: LoadingService,
    private userService: UserService,
    private languageService: LanguageService,
    private themeService: ThemeService
  ) {
    this.languageService.setUserLanguage();
    this.themeService.initializeThemeUserFromLocalStorage();
  }

  ngOnInit(): void {
    this.loadingService.setLoading(true);
    this.initializeForm();

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user && user.id) {
          this.userId = user.id;

          // Combine both observables
          forkJoin([
            this.workoutService.getWorkouts(this.userId),
            this.workoutService.getUniqueWorkoutNames(this.userId),
          ]).subscribe({
            next: ([workouts, names]) => {
              this.workoutLogs = workouts.sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              this.totalWorkouts = workouts.length;
              this.workoutNames = names;
            },
            error: (error) => {
              console.error('Error loading workouts or names:', error);
            },
            complete: () => {
              // Hide spinner after both calls complete
              this.loadingService.setLoading(false);
            },
          });
        }
      },
      error: () => {
        console.error('Failed to fetch current user');
        this.loadingService.setLoading(false);
      },
    });
  }

  loadWorkoutNames(): void {
    this.workoutService.getUniqueWorkoutNames(this.userId).subscribe({
      next: (names) => {
        this.workoutNames = names;
      },
      error: (error) => {
        console.error('Error fetching workout names:', error);
      },
    });
  }

  initializeForm(): void {
    this.workoutForm = this.fb.group({
      name: ['', Validators.required],
      date: [new Date().toISOString().split('T')[0]],
    });
  }

  logWorkout(): void {
    if (this.workoutForm.valid) {
      const newWorkout: Workout = {
        ...this.workoutForm.value,
        userId: this.userId,
      };

      this.loadingService.setLoading(true);

      this.workoutService.addWorkout(newWorkout).subscribe({
        next: (workout) => {
          this.workoutLogs.push(workout);
          this.workoutLogs.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          this.totalWorkouts++;
          if (!this.workoutNames.includes(workout.name)) {
            this.workoutNames.push(workout.name);
          }
          this.toggleForm();
          this.workoutForm.reset({
            name: '',
            date: new Date().toISOString().split('T')[0],
          });
        },
        error: (error) => {
          console.error('Error logging workout:', error);
        },
        complete: () => {
          this.loadingService.setLoading(false);
        },
      });
    } else {
      console.error('Form is invalid. Please fill out all required fields.');
    }
  }

  loadWorkouts(): void {
    this.workoutService.getWorkouts(this.userId).subscribe((workouts) => {
      this.workoutLogs = workouts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      this.totalWorkouts = workouts.length;
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  showDeleteConfirmation(workoutId: number): void {
    this.workoutToDeleteId = workoutId;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.workoutToDeleteId = undefined;
  }

  confirmDelete(): void {
    if (!this.workoutToDeleteId) {
      return;
    }
    this.loadingService.setLoading(true);

    this.workoutService.deleteWorkout(this.workoutToDeleteId).subscribe({
      next: () => {
        this.workoutLogs = this.workoutLogs.filter(
          (workout) => workout.id !== this.workoutToDeleteId
        );
        this.totalWorkouts--;
        this.cancelDelete();
      },
      error: (error) => {
        console.error('Error deleting workout:', error);
      },
      complete: () => {
        this.loadingService.setLoading(false);
      },
    });
  }
}
