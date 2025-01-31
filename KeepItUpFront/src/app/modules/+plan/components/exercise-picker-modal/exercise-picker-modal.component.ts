import { PlanService } from '../../../../shared/service/plan.service';
import { TOAST_MSGS } from '../../../../shared/constants';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Exercise } from '../../../../shared/interfaces/exercise';
import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MuscleGroup } from '../../../../shared/interfaces/musclegroup';
import { WorkoutExercise } from '../../../../shared/interfaces/workoutexercise';
import { ToastService } from '../../../../shared/service/toast.service';
import { UserService } from '../../../../shared/service/user.service';
import { ExerciseService } from '../../../../shared/service/exercise.service';
import { CreateExerciseModalComponent } from '../create-exercise-modal/create-exercise-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-exercise-picker-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CreateExerciseModalComponent,
    TranslateModule
  ],
  templateUrl: './exercise-picker-modal.component.html',
  styleUrl: './exercise-picker-modal.component.css',
})
export class ExercisePickerModalComponent implements OnInit {
  exercises: Exercise[] = [];
  filteredExercises: Exercise[] = [];
  searchControl: FormControl = new FormControl('');
  selectedExercise: Exercise | null = null;
  creatingNewExercise: boolean = false;
  muscleGroups: MuscleGroup[] = [];
  userId: number | null = null;
  noExercisesFound: boolean = false;

  isCreateExerciseModalOpen = false;

  @Input() planId: number | null = null;
  @Input() workoutId: number | null = null;
  @Input() isExercisePickerModalOpen: boolean = false;
  @Input() existingExercises: string[] = [];
  @Input() currentExercises: WorkoutExercise[] = [];
  @Output() closeModal = new EventEmitter<void>();
  @Output() exerciseSelected = new EventEmitter<WorkoutExercise>();

  newExerciseForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    muscleGroup: new FormControl('', Validators.required),
  });

  constructor(
    private exerciseService: ExerciseService,
    private toastService: ToastService,
    private userService: UserService,
    private planService: PlanService
  ) {}

  ngOnInit(): void {
    this.loadExercises();
    this.getCurrentUserId();
    this.searchControl.valueChanges.subscribe((searchText) => {
      this.filterExercises(searchText);
    });
  }

  openCreateExerciseModal(): void {
    this.isCreateExerciseModalOpen = true;

    const currentSearchText = this.searchControl.value.trim();
    if (currentSearchText) {
      this.newExerciseForm.patchValue({ name: currentSearchText });
    }
  }

  closeCreateExerciseModal(): void {
    this.isCreateExerciseModalOpen = false;
  }
  closeExercisePickerModal(): void {
    this.closeModal.emit();
  }

  getCurrentUserId(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user && user.id) {
        this.userId = user.id;
        this.loadExercises();
      }
    });
  }

  loadExercises(): void {
    if (this.userId !== null) {
      this.exerciseService
        .getallExercises(this.userId)
        .subscribe((exercises) => {
          this.exercises = exercises;
          this.filterExercises('');
        });
    }
  }

  filterExercises(searchText: string): void {
    const existingExerciseIds = this.currentExercises.map(
      (exercise) => exercise.exerciseId
    );

    this.filteredExercises = this.exercises
      .filter((exercise) =>
        exercise.name.toLowerCase().includes(searchText.toLowerCase())
      )
      .filter((exercise) => !existingExerciseIds.includes(exercise.id));

    this.noExercisesFound = this.filteredExercises.length === 0;
  }

  selectExercise(exercise: Exercise): void {
    const workoutExercise: WorkoutExercise = {
      exerciseName: exercise.name,
      exerciseOrder: this.currentExercises.length + 1,
      workoutId: this.workoutId!,
      exerciseId: exercise.id,
    };

    this.exerciseSelected.emit(workoutExercise);
    this.closeModal.emit();
  }

  deselectExercise(): void {
    this.selectedExercise = null;
  }

  onSubmit(): void {
    if (this.selectedExercise) {
      const workoutExercise = {
        exerciseName: this.selectedExercise.name,
      };
      // this.activeModal.close(workoutExercise);
    }
  }

  onCancel(): void {
    // this.activeModal.dismiss();
  }

  deleteExercise(exerciseId: number): void {
    this.exerciseService.deleteExercise(exerciseId).subscribe({
      next: () => {
        this.exercises = this.exercises.filter(
          (exercise) => exercise.id !== exerciseId
        );
        this.filterExercises(this.searchControl.value || '');
        this.toastService.showToast(
          TOAST_MSGS.exercise_deleted_successfully,
          'success'
        );      },
      error: (err) => {
        console.error('Failed to delete exercise:', err);
        this.toastService.showToast(          TOAST_MSGS.failed_to_delete_exercise,
          'danger');
      },
    });
  }
  handleCreatedExercise(exercise: any): void {
    // Agregar el nuevo ejercicio a la lista de ejercicios
    this.exercises.push(exercise);
    this.filterExercises(''); // Actualizar lista filtrada

    // Selecciona el ejercicio recién creado automáticamente
    this.selectExercise(exercise);
    this.closeModal.emit();

  }
}
