import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { TOAST_MSGS } from '../../../../shared/constants';
import { MuscleGroup } from '../../../../shared/interfaces/musclegroup';
import { ExerciseService } from '../../../../shared/service/exercise.service';
import { ToastService } from '../../../../shared/service/toast.service';
import { UserService } from '../../../../shared/service/user.service';

@Component({
  selector: 'app-create-exercise-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.css',
})
export class CreateExerciseModalComponent implements OnInit {
  @Input() isCreateExerciseModalOpen: boolean = false;
  @Input() planId: number | null = null;
  @Input() workoutId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();

  newExerciseForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    muscleGroup: new FormControl('', Validators.required),
  });
  muscleGroups: MuscleGroup[] = [];
  userId: number | null = null;

  constructor(
    private exerciseService: ExerciseService,
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadMuscleGroups();
    this.getCurrentUserId();
  }

  getCurrentUserId(): void {
    this.userService.getCurrentUser().subscribe((user) => {
      if (user && user.id) {
        this.userId = user.id;
      }
    });
  }

  loadMuscleGroups(): void {
    this.exerciseService.getMuscleGroups().subscribe((groups) => {
      this.muscleGroups = groups;
    });
  }

  onCreateNewExercise(): void {

    if (this.newExerciseForm.invalid) {
      Object.keys(this.newExerciseForm.controls).forEach((field) => {
        const control = this.newExerciseForm.get(field);
        control?.markAsTouched();
      });
      return;
    }

    const newExerciseName = this.newExerciseForm.get('name')?.value.trim();
    const description = this.newExerciseForm.get('description')?.value;
    const muscleGroupId = this.newExerciseForm.get('muscleGroup')?.value;
    console.log(
      'Form Values - Name:',
      newExerciseName,
      'Description:',
      description,
      'Muscle Group ID:',
      muscleGroupId
    );

    if (!newExerciseName) {
      this.toastService.showToast(
        'Please provide a name for the exercise.',
        'danger'
      );
      return;
    }

    if (!muscleGroupId) {
      this.toastService.showToast(
        'Please select a muscle group or leave it empty.',
        'danger'
      );
      return;
    }

    if (!this.userId || !this.planId || !this.workoutId) {
      this.toastService.showToast(
        'Error creating exercise. Please try again later.',
        'danger'
      );

      return;
    }

    if (newExerciseName && muscleGroupId) {
      const newExercise = {
        name: newExerciseName,
        description: description || null,
        muscleGroup: { id: muscleGroupId },
        userId: this.userId,
        planId: this.planId,
        workoutId: this.workoutId,
      };

      this.exerciseService.createOrCheckExercise(newExercise).subscribe({
        next: (response) => {
          console.log('Backend Response:', response);

          const exercise = response as any;

          if (exercise) {
            if (exercise.exists) {
              console.log('Exercise already exists:', exercise.name);

              this.toastService.showToast('hola' + exercise.name, 'danger');
            } else {
              this.toastService.showToast(
                TOAST_MSGS.exercisecreated + exercise.name,
                'success'
              );

              this.closeCreateExercise();
            }
          }
        },
        error: (err) => {
          console.error('Error creating exercise:', err);
          this.toastService.showToast(
            'Error creating exercise. Please try again.',
            'danger'
          );
        },
      });
    }
  }

  closeCreateExercise(): void {
    this.closeModal.emit();
  }
}
