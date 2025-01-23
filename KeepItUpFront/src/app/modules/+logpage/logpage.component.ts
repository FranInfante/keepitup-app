import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackToMenuComponent } from '../../shared/components/back-to-menu/back-to-menu.component';
import { ASSET_URLS, LOCATIONS, MSG, TOAST_MSGS } from '../../shared/constants';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlanService } from '../../shared/service/plan.service';
import { ToastService } from '../../shared/service/toast.service';
import { UserService } from '../../shared/service/user.service';
import { WorkoutDataService } from '../../shared/service/workoutdata.service';
import { WorkoutLog } from '../../shared/interfaces/workoutlog';
import { WorkoutLogService } from '../../shared/service/workoutlog.service';
import { ConfirmationModalComponent } from '../../shared/components/comfirmation-modal/cofirmation-modal.component';
import { ContinueOrResetModalComponent } from '../../shared/components/continue-or-reset-modal/continue-or-reset-modal.component';

@Component({
  selector: 'app-logpage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BackToMenuComponent,
    FormsModule,
    ConfirmationModalComponent,
    ContinueOrResetModalComponent,
  ],
  templateUrl: './logpage.component.html',
  styleUrl: './logpage.component.css',
})
export class LogpageComponent implements OnInit, OnDestroy {
  workoutLogForm!: FormGroup;
  workoutId!: number;
  workoutLogId!: number;
  userId!: number;
  DeleteIcon: string = ASSET_URLS.DeleteIcon;
  NotesIcon: string = ASSET_URLS.NotesIcon;
  formChangesSubscription!: Subscription;
  firstChangeMade: boolean = false;
  LOCATIONS: typeof LOCATIONS = LOCATIONS;
  isInputFocused: boolean = false;
  selectedExercise: string = '';
  currentNotes: string = '';

  selectedExerciseIndex: number | null = null;
  updateTimeout: any;
  workoutName: string = '';

  isConfirmationModalOpen: boolean = false;
  isContinueOrResetModalOpen: boolean = false;

  editingLog: WorkoutLog | null = null;


  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
    private workoutLogService: WorkoutLogService,
    private workoutDataService: WorkoutDataService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.workoutLogForm = this.fb.group({
      
      exercises: this.fb.array([]),
    });



    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        if (user.id !== undefined) {
          this.userId = user.id;
          this.initializeWorkoutLog();
        } else {
          console.error(MSG.fetcherror);
        }
      },
      error: (err) => {
        console.error(MSG.fetcherror, err);
      },
    });
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }
  backToPlans() {
    this.isConfirmationModalOpen = true;
  }
  handleModalConfirmResponse(action: string) {
    this.isConfirmationModalOpen = false;
    if (action === 'save') {
      this.saveAndNavigate();
    } else if (action === 'discard') {
      this.discardAndNavigate();
    }
  }

  closeConfirmationModal() {
    this.isConfirmationModalOpen = false;
  }
  saveAndNavigate() {
    this.router.navigate([LOCATIONS.plans]);
  }

  discardAndNavigate() {
    if (this.workoutLogId) {
      this.workoutLogService.deleteWorkoutLog(this.workoutLogId).subscribe({
        next: () => {
          this.router.navigate([LOCATIONS.plans]);
        },
        error: (error) => {
          console.error('Error deleting workout log', error);
        },
      });
    } else {
      this.router.navigate([LOCATIONS.plans]);
    }
  }

  initializeWorkoutLog() {
    const workoutId = this.workoutDataService.getWorkoutId();

    if (workoutId) {
      this.workoutId = workoutId;

      this.fetchWorkoutName(workoutId);

      this.workoutLogService
        .getWorkoutLogByUserIdAndIsEditing(this.userId, true)
        .subscribe({
          next: (editingLogs) => {
            if (editingLogs && editingLogs.length > 0) {
              const editingLog = editingLogs.find(
                (log: WorkoutLog) => log.editing === true
              );
              if (editingLog) {
                this.askUserToContinueOrReset(editingLog);
              } else {
                this.createAndLoadWorkoutLog();
              }
            } else {
              this.createAndLoadWorkoutLog();
            }
          },
          error: (err) => {
            console.error('MSG.errorfindingworkout', err);
            this.createAndLoadWorkoutLog();
          },
        });
    } else {
      this.router.navigate([LOCATIONS.plans]);
    }
  }

  askUserToContinueOrReset(editingLog: WorkoutLog) {
    this.editingLog = editingLog;
    this.isContinueOrResetModalOpen = true;
  }

  handleModalResetResponse(action: string) {
    this.isContinueOrResetModalOpen = false;
  
    if (action === 'continue' && this.editingLog) {
      this.workoutLogId = this.editingLog.id; 
      this.populateFormWithSavedData(this.editingLog);
      this.trackFormChanges();
    } else if (action === 'reset' && this.editingLog) {
      this.workoutLogService.deleteWorkoutLog(this.editingLog.id).subscribe({
        next: () => {
          this.createAndLoadWorkoutLog();
        },
        error: (err) => {
          console.error('Error deleting existing workout log', err);
        },
      });
    }
    this.editingLog = null; // Clear the reference
  }
  trackFormChanges() {
    if (!this.workoutLogId) {
      return;
    }

    let updateTimeout: any;

    this.formChangesSubscription = this.workoutLogForm.valueChanges.subscribe(
      () => {
        if (this.workoutLogId && this.firstChangeMade) {
          // Validate the form before triggering an update
          if (this.workoutLogForm.valid && this.hasValidSets()) {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(() => {
              this.updateWorkoutLog();
            }, 100);
          }
        }
      }
    );
  }

  hasValidSets(): boolean {
    return this.exercises.controls.every((exercise) =>
      this.getSets(exercise).controls.every(
        (set) => set.get('reps')?.value > 0 && set.get('weight')?.value >= 0
      )
    );
  }

  loadWorkoutDetailsAndCreateWorkoutLog(workoutId: number) {
    this.planService.getWorkoutById(workoutId).subscribe({
      next: (workout) => {
        this.workoutName = workout.name || '';
        this.populateFormWithWorkout(workout);
        this.createWorkoutLog();
      },
      error: (err) => {
        console.error('MSG.errorfindingworkout', err);
      },
    });
  }

  populateFormWithWorkout(workout: any) {
    const exercisesArray = this.workoutLogForm.get('exercises') as FormArray;
    exercisesArray.clear();

    if (
      workout &&
      workout.workoutExercises &&
      Array.isArray(workout.workoutExercises)
    ) {
      workout.workoutExercises
        .sort(
          (a: { exerciseOrder: number }, b: { exerciseOrder: number }) =>
            a.exerciseOrder - b.exerciseOrder
        )
        .forEach((exercise: any) => {
          exercisesArray.push(
            this.fb.group({
              id: [exercise.id],
              exerciseId: [exercise.exerciseId],
              name: [exercise.exerciseName],
              sets: this.fb.array(
                exercise.sets
                  ? exercise.sets.map((set: any) =>
                      this.createSetWithValues(set)
                    )
                  : [this.createSet()]
              ),
              notes: [exercise.notes || ''],
              open: [false],
            })
          );
        });
    }
  }

  populateFormWithSavedData(savedWorkoutLog: WorkoutLog) {
    const exercisesArray = this.workoutLogForm.get('exercises') as FormArray;
    exercisesArray.clear();

    if (savedWorkoutLog && savedWorkoutLog.exercises) {
      // Sort exercises by exerciseOrder
      const sortedExercises = savedWorkoutLog.exercises.sort(
        (a, b) => a.exerciseOrder - b.exerciseOrder
      );

      sortedExercises.forEach((exercise) => {
        const formGroup = this.fb.group({
          id: [exercise.id],
          exerciseId: [exercise.exerciseId],
          workoutLogId: [exercise.workoutLogId],
          name: [exercise.exerciseName],
          notes: [exercise.notes || ''],
          open: [false],
          sets: this.fb.array([]),
        });

        exercisesArray.push(formGroup);

        const setsArray = formGroup.get('sets') as FormArray;
        exercise.sets.forEach((set) => {
          setsArray.push(this.createSetWithValues(set));
        });
      });
    }
  }

  createSetWithValues(set: any): FormGroup {
    return this.fb.group({
      reps: [
        set.reps,
        [Validators.required, Validators.min(0), Validators.max(999)],
      ],
      weight: [
        set.weight,
        [Validators.required, Validators.min(0), Validators.max(999)],
      ],
    });
  }

  createSet(): FormGroup {
    return this.fb.group({
      reps: [0, [Validators.required, Validators.min(0), Validators.max(999)]],
      weight: [
        0,
        [Validators.required, Validators.min(0), Validators.max(999)],
      ],
    });
  }

  addSet(exerciseIndex: number) {
    const sets = this.getSets(this.exercises.at(exerciseIndex));
    sets.push(this.createSet());

    this.updateWorkoutLog();
  }

  getSets(exercise: any): FormArray {
    return exercise.get('sets') as FormArray;
  }

  get exercises(): FormArray {
    return this.workoutLogForm.get('exercises') as FormArray;
  }

  toggleDropdown(index: number) {
    const exercise = this.exercises.at(index);
    exercise.patchValue({ open: !exercise.value.open });
  }

  createAndLoadWorkoutLog() {
    this.planService.getWorkoutById(this.workoutId).subscribe({
      next: (workout) => {
        this.populateFormWithWorkout(workout);
        this.createWorkoutLog();
      },
      error: (err) => {
        console.error('MSG.errorfindingworkout', err);
      },
    });
  }

  loadSavedWorkoutLog() {
    this.workoutLogService.getWorkoutLogById(this.workoutLogId).subscribe({
      next: (savedWorkoutLog) => {
        this.populateFormWithSavedData(savedWorkoutLog);
      },
      error: (err) => {
        console.error('MSG.errorfindingworkout', err);
      },
    });
  }

  createWorkoutLog() {
    if (this.workoutLogId) {
      return;
    }

    const initialWorkoutLog = {
      userId: this.userId,
      workoutId: this.workoutId,
      date: new Date().toISOString(),
      exercises: this.exercises.controls.map((exerciseControl, index) => ({
        exerciseId: exerciseControl.get('exerciseId')?.value,
        exerciseOrder: index + 1,
        sets: this.getSets(exerciseControl).controls.map(
          (setControl, setIndex) => ({
            set: setIndex + 1,
            reps: setControl.get('reps')?.value,
            weight: setControl.get('weight')?.value,
          })
        ),
      })),
      editing: true,
    };

    this.workoutLogService.createWorkoutLog(initialWorkoutLog).subscribe({
      next: (response) => {
        this.workoutLogId = response.id;
        this.loadSavedWorkoutLog();
        this.firstChangeMade = true;
        this.trackFormChanges();
      },
      error: (error) => {
        this.toastService.showToast(
          'TOAST_MSGS.errorcreatingworkout',
          'danger'
        );
      },
    });
  }

  updateWorkoutLog() {
    if (!this.workoutLogId) {
      this.createWorkoutLog();
      return;
    }

    const updatedWorkoutLog = {
      userId: this.userId,
      workoutId: this.workoutId,
      date: new Date().toISOString(),
      exercises: this.exercises.controls.map((exerciseControl, index) => ({
        id: exerciseControl.get('id')?.value,
        exerciseId: exerciseControl.get('exerciseId')?.value,
        notes: exerciseControl.get('notes')?.value,
        sets: this.getSets(exerciseControl).controls.map(
          (setControl, setIndex) => ({
            set: setIndex + 1,
            reps: setControl.get('reps')?.value,
            weight: setControl.get('weight')?.value,
          })
        ),
      })),
      editing: true,
    };

    // Proceed with the update request
    if (
      updatedWorkoutLog.exercises.some((exercise) => exercise.sets.length > 0)
    ) {
      this.workoutLogService
        .updateWorkoutLog(this.workoutLogId, updatedWorkoutLog)
        .subscribe({
          next: () => {},
          error: (error) => {
            console.error('Error updating workout log', error);
            this.toastService.showToast(
              'TOAST_MSGS.errorcreatingworkout',
              'danger'
            );
          },
        });
    }
  }

  submitWorkoutLog() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }

    setTimeout(() => {
      if (this.workoutLogForm.valid) {
        const exercisesArray = this.exercises.controls.map(
          (exerciseControl) => ({
            id: exerciseControl.get('id')?.value,
            exerciseId: exerciseControl.get('exerciseId')?.value,
            workoutLogId: this.workoutLogId,
            sets: this.getSets(exerciseControl).controls.map(
              (setControl, setIndex) => ({
                set: setIndex + 1,
                reps: setControl.get('reps')?.value,
                weight: setControl.get('weight')?.value,
              })
            ),
          })
        );

        const workoutLogData = {
          userId: this.userId,
          workoutId: this.workoutId,
          date: new Date().toISOString(),
          exercises: exercisesArray,
          editing: false, // Set editing to false since the log is being submitted
        };

        this.workoutLogService
          .updateWorkoutLog(this.workoutLogId, workoutLogData)
          .subscribe({
            next: () => {
              this.toastService.showToast(
                TOAST_MSGS.workoutdeletedsaved,
                'success'
              );
              this.router.navigate(['/log-registry']);
            },
            error: (error) => {
              this.toastService.showToast(
                'TOAST_MSGS.errorcreatingworkout',
                'danger'
              );
            },
          });
      } else {
        this.toastService.showToast('TOAST_MSGS.fillallfields', 'danger');
      }
    }, 200);
  }

  clearInput(
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight'
  ) {
    const exercise = this.exercises.at(exerciseIndex);
    const set = this.getSets(exercise).at(setIndex);

    if (set.get(field)?.value === 0) {
      set.get(field)?.setValue('');
    }
  }

  limitInputLength(event: Event, maxLength: number) {
    const input = event.target as HTMLInputElement;

    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }

  resetToZero(
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight'
  ) {
    const exercise = this.exercises.at(exerciseIndex);
    const set = this.getSets(exercise).at(setIndex);

    const fieldValue = set.get(field)?.value;
    if (fieldValue === '' || fieldValue === null || fieldValue === undefined) {
      set.get(field)?.setValue(0);
    }
  }

  deleteSet(exerciseIndex: number, setIndex: number) {
    const exerciseControl = this.exercises.at(exerciseIndex);
    const sets = this.getSets(exerciseControl);

    if (sets.length === 1) {
      this.toastService.showToast('TOAST_MSGS.cantdeleteallsets', 'danger');
      return;
    }

    const exerciseId = exerciseControl.get('exerciseId')?.value;
    const workoutLogId = this.workoutLogId;
    const setNumber = setIndex + 1;

    if (exerciseId !== undefined && workoutLogId !== undefined) {
      this.workoutLogService
        .deleteWorkoutLogSet(workoutLogId, exerciseId, setNumber)
        .subscribe({
          next: () => {
            sets.removeAt(setIndex);
          },
          error: (error) => {
            this.toastService.showToast(
              'TOAST_MSGS.errorcreatingworkout',
              'danger'
            );
          },
        });
    }
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    this.isInputFocused = false;
  }

  hasSets(): boolean {
    return this.exercises.controls.some(
      (exercise) => this.getSets(exercise).length > 0
    );
  }

  setSelectedExercise(exerciseIndex: number) {
    const exerciseControl = this.exercises.at(exerciseIndex);
    if (exerciseControl) {
    } else {
      console.error('MSG.noexercisecontrolfound', exerciseIndex);
    }

    this.selectedExerciseIndex = exerciseIndex;
    this.selectedExercise = exerciseControl.get('name')?.value || 'Unknown';
  }

  saveExerciseNotes() {
    if (this.selectedExerciseIndex !== null) {
      const exerciseControl = this.exercises.at(
        this.selectedExerciseIndex
      ) as FormGroup;
      const workoutLogExerciseId = exerciseControl.get('id')?.value;
      const exerciseId = exerciseControl.get('exerciseId')?.value;
      const workoutLogId = this.workoutLogId;

      if (workoutLogExerciseId) {
        const sets = this.getSets(exerciseControl).controls.map(
          (setControl, setIndex) => ({
            set: setIndex + 1,
            reps: setControl.get('reps')?.value,
            weight: setControl.get('weight')?.value,
          })
        );

        const updatedExercise = {
          exerciseId: exerciseId,
          workoutLogId: workoutLogId,
          sets: sets,
          notes: exerciseControl.get('notes')?.value || '',
        };

        this.workoutLogService
          .updateWorkoutLogExercise(workoutLogExerciseId, updatedExercise)
          .subscribe({
            next: () => {
              this.toastService.showToast(
                'TOAST_MSGS.notessavedsuccessfully',
                'success'
              );
            },
            error: (error) => {
              this.toastService.showToast(
                'TOAST_MSGS.errorcreatingworkout',
                'danger'
              );
            },
          });
      }
    }
  }

  getExerciseFormGroup(exerciseIndex: number): FormGroup {
    return this.exercises.at(exerciseIndex) as FormGroup;
  }

  triggerWorkoutLogUpdate(exerciseIndex: number, setIndex: number) {
    const exerciseControl = this.exercises.at(exerciseIndex);
    const setControl = this.getSets(exerciseControl).at(setIndex);

    const repsValue = setControl.get('reps')?.value;
    const weightValue = setControl.get('weight')?.value;

    // Only update if the values are non-null, defined, and 0 or greater
    if (
      repsValue !== null &&
      repsValue !== undefined &&
      repsValue >= 0 &&
      weightValue !== null &&
      weightValue !== undefined &&
      weightValue >= 0
    ) {
      clearTimeout(this.updateTimeout);

      this.updateTimeout = setTimeout(() => {
        this.updateWorkoutLog();
      }, 100);
    }
  }
  fetchWorkoutName(workoutId: number) {
    this.planService.getWorkoutById(workoutId).subscribe({
      next: (workout) => {
        this.workoutName = workout.name || '';
      },
      error: (err) => {
        console.error('MSG.errorfindingworkout', err);
      },
    });
  }

  isLastSetValid(exerciseIndex: number): boolean {
    const exerciseControl = this.exercises.at(exerciseIndex) as FormGroup;
    const setsArray = this.getSets(exerciseControl);
    const lastSet = setsArray.at(setsArray.length - 1) as FormGroup;

    return !!(
      lastSet.get('reps')?.valid &&
      lastSet.get('weight')?.valid &&
      lastSet.get('reps')?.value > 0 &&
      lastSet.get('weight')?.value >= 0
    );
  }
}
