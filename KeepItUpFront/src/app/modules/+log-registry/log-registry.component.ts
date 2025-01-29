import { Component, OnInit } from '@angular/core';
import { WorkoutLogService } from '../../shared/service/workoutlog.service';
import { UserService } from '../../shared/service/user.service';
import { CommonModule } from '@angular/common';
import { WorkoutLogDetailModalComponent } from './components/work-log-detail/work-log-detail.component';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { PlanService } from '../../shared/service/plan.service';
import { FormsModule } from '@angular/forms';
import { WorkoutDataService } from '../../shared/service/workoutdata.service';
import { LOCATIONS, MSG } from '../../shared/constants';
import { ThemeService } from '../../shared/service/theme.service';

@Component({
  selector: 'app-log-registry',
  standalone: true,
  imports: [
    CommonModule,
    WorkoutLogDetailModalComponent,
    BackToMenuComponent,
    FormsModule,
  ],
  templateUrl: './log-registry.component.html',
  styleUrl: './log-registry.component.css',
})
export class LogRegistryComponent implements OnInit {
  userId!: number;
  workoutLogs: any[] = [];
  isLoading: boolean = true;
  selectedWorkoutLog: any = null;
  showModal: boolean = false;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;

  plans: any[] = [];
  selectedWorkoutId: string = '';
  filteredWorkoutLogs: any[] = [];

  constructor(
    private workoutLogService: WorkoutLogService,
    private userService: UserService,
    private planService: PlanService,
    private workoutDataService: WorkoutDataService,
    private themeService: ThemeService
  ) {
    this.themeService.initializeThemeUserFromLocalStorage();
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.id !== undefined) {
          this.userId = user.id;
          this.getWorkoutLogsForUser();
          this.getPlansForUser();
          const workoutId = this.workoutDataService.getWorkoutId();
          if (workoutId !== null) {
            this.selectedWorkoutId = workoutId.toString();
            this.filterWorkoutLogs();
          }
        } else {
          console.error('MSG.useridundefined');
        }
      },
      error: (err) => {
        console.error('MSG.failedtogetuserid', err);
      },
    });
  }

  getWorkoutLogsForUser() {
    this.workoutLogService.getWorkoutLogByUserId(this.userId).subscribe({
      next: (logs) => {
        this.workoutLogs = logs.map((log) => {
          return {
            ...log,
            date: new Date(
              log.date[0],
              log.date[1] - 1,
              log.date[2],
              log.date[3],
              log.date[4],
              log.date[5]
            ),
            exercises: log.exercises,
          };
        });
        this.isLoading = false;
        this.filterWorkoutLogs();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }
  getGroupedExercises(exercises: any[]): any[] {
    const groupedExercises: any[] = [];
    exercises.forEach((exercise: any) => {
      const existingExercise = groupedExercises.find(
        (e) => e.exerciseId === exercise.exerciseId
      );

      if (existingExercise) {
        existingExercise.sets.push(...exercise.sets);
      } else {
        groupedExercises.push({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          notes: exercise.notes || '',
          sets: [...exercise.sets],
          exercise_order: exercise.exerciseOrder,
        });
      }
    });

    return groupedExercises.sort((a, b) => a.exercise_order - b.exercise_order);
  }

  viewWorkoutLog(log: any) {
    const groupedExercises = this.getGroupedExercises(log.exercises);

    groupedExercises.sort((a, b) => a.exercise_order - b.exercise_order);

    this.selectedWorkoutLog = {
      ...log,
      exercises: groupedExercises,
    };

    this.showModal = true;
  }

  closeWorkoutLogModal() {
    this.showModal = false;
    this.selectedWorkoutLog = null;
  }

  getPlansForUser() {
    this.planService.getPlansByUserId(this.userId).subscribe({
      next: (plans) => {
        this.plans = plans;
      },
    });
  }

  filterWorkoutLogs() {
    if (this.selectedWorkoutId) {
      this.filteredWorkoutLogs = this.workoutLogs.filter(
        (log) => log.workoutId === parseInt(this.selectedWorkoutId, 10)
      );
    } else {
      this.filteredWorkoutLogs = [...this.workoutLogs];
    }
  }
}
