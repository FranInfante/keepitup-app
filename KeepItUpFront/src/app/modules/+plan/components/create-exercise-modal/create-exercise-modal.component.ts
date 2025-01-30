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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-create-exercise-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './create-exercise-modal.component.html',
  styleUrl: './create-exercise-modal.component.css',
})
export class CreateExerciseModalComponent implements OnInit {
  @Input() isCreateExerciseModalOpen: boolean = false;
  @Input() planId: number | null = null;
  @Input() workoutId: number | null = null;
  @Output() closeModal = new EventEmitter<void>();
  @Output() exerciseCreated = new EventEmitter<any>();
  @Input() defaultExerciseName: string = ''; 



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


    if (!newExerciseName || !muscleGroupId || !this.userId || !this.planId || !this.workoutId) {  
      this.toastService.showToast('Error creating exercise. Please check all fields.', 'danger');
      return;
    }
  
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
            this.toastService.showToast('Exercise already exists: ' + exercise.name, 'danger');
          } else {
            this.toastService.showToast('Exercise created: ' + exercise.name, 'success');
  
            // Emit the created exercise
            this.exerciseCreated.emit(exercise);
            this.closeCreateExercise();
          }
        }
      },
      error: (err) => {
        console.error("❌ Error creating exercise:", err);
        this.toastService.showToast('Error creating exercise. Please try again.', 'danger');
      },
    });
  }
  

  ngOnInit(): void {
  

    this.loadMuscleGroups();
    this.getCurrentUserId();

    if (this.defaultExerciseName) {
      this.newExerciseForm.patchValue({ name: this.defaultExerciseName });
    }
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

 

  closeCreateExercise(): void {
    this.closeModal.emit();
  }
}
