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
import { SetDetails, WorkoutLogExercise } from '../../shared/interfaces/workoutlog';
import { TranslateModule } from '@ngx-translate/core';
import { GymService } from '../../shared/service/gym.service';

@Component({
  selector: 'app-log-registry',
  standalone: true,
  imports: [
    CommonModule,
    WorkoutLogDetailModalComponent,
    BackToMenuComponent,
    FormsModule,
    TranslateModule
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

  gyms: any[] = [];

  constructor(
    private workoutLogService: WorkoutLogService,
    private userService: UserService,
    private planService: PlanService,
    private workoutDataService: WorkoutDataService,
    private themeService: ThemeService,
    private gymService : GymService
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
          this.loadGyms(); 
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

  loadGyms() {
    this.gymService.getUserGyms(this.userId).subscribe({
      next: (gyms) => {
        this.gyms = gyms;
      },
      error: (err) => {
        console.error('Failed to load gyms', err);
      },
    });
  }

  getWorkoutLogsForUser() {
    this.workoutLogService.getWorkoutLogByUserId(this.userId).subscribe({
      next: (logs) => {
        this.workoutLogs = logs
          .map((log) => {
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
              gymId: log.gymId,
            };
          })
          .sort((a, b) => b.date.getTime() - a.date.getTime());
  
        this.isLoading = false;
        this.filterWorkoutLogs();
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  getGymName(gymId: number | null): string {
    if (!gymId) {
      return ""; // Replace with a neutral default message
    }
  
    const gym = this.gyms.find(g => g.id === gymId);
    return gym ? gym.name : "";
  }
  getGroupedExercises(exercises: WorkoutLogExercise[]): WorkoutLogExercise[] {
    const groupedExercises: WorkoutLogExercise[] = [];
  
    exercises.forEach((exercise: WorkoutLogExercise) => {
      const existingExercise = groupedExercises.find(e => e.exerciseId === exercise.exerciseId);
  
      if (existingExercise) {
        existingExercise.sets.push(...exercise.sets);
      } else {
        groupedExercises.push({
          ...exercise,
          sets: [...exercise.sets],
        });
      }
    });
  
    // 🔹 Ensure exercises are sorted by exerciseOrder
    return groupedExercises.sort((a, b) => a.exerciseOrder - b.exerciseOrder);
  }
  

  viewWorkoutLog(log: any) {
    const groupedExercises = this.getGroupedExercises(log.exercises);
  
    // Ensure exercises are sorted by exerciseOrder
    groupedExercises.sort((a: WorkoutLogExercise, b: WorkoutLogExercise) => a.exerciseOrder - b.exerciseOrder);
  
    // Ensure sets inside each exercise are sorted from 1 to N
    groupedExercises.forEach((exercise: WorkoutLogExercise) => {
      exercise.sets.sort((a: SetDetails, b: SetDetails) => a.set - b.set);
    });
  
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

  updateWorkoutLogGym() {
    if (!this.selectedWorkoutLog) return;

    this.workoutLogService.updateWorkoutLog(this.selectedWorkoutLog.id, {
      gymId: this.selectedWorkoutLog.gymId || null  // Allow removing gym
    }).subscribe({
      next: () => {
        this.getWorkoutLogsForUser();
        this.closeWorkoutLogModal();
      }
    });
  }

  updateLogRegistryGym(event: { workoutLogId: number; gymId: number }) {
  
    this.workoutLogs = this.workoutLogs.map(log =>
      log.id === event.workoutLogId ? { ...log, gymId: Number(event.gymId) } : log
    );
  
    this.filteredWorkoutLogs = [...this.workoutLogs];
  }
  
}
