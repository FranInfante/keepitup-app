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
    // public activeModal: NgbActiveModal,
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
    const newExerciseName = this.newExerciseForm.get('name')?.value.trim();
    const description = this.newExerciseForm.get('description')?.value;
    const muscleGroupId = this.newExerciseForm.get('muscleGroup')?.value;

    if (!this.userId || !this.planId || !this.workoutId) {
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
          const exercise = response as any;

          if (exercise) {
            if (exercise.exists) {
              this.toastService.showToast('hola' + exercise.name, 'danger');
            } else {
              this.toastService.showToast(
                TOAST_MSGS.exercisecreated + exercise.name,
                'success'
              );
              const workoutExercise = { exerciseName: exercise.name };
              // this.activeModal.close(workoutExercise);
            }
          }
        },
      });
    }
  }

  closeCreateExercise(): void {
    this.closeModal.emit();
  }
}
