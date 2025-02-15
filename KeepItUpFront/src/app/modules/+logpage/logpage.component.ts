import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
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
import {
  WorkoutLog,
  WorkoutLogExercise,
} from '../../shared/interfaces/workoutlog';
import { WorkoutLogService } from '../../shared/service/workoutlog.service';
import { ConfirmationModalComponent } from '../../shared/components/comfirmation-modal/cofirmation-modal.component';
import { ContinueOrResetModalComponent } from '../../shared/components/continue-or-reset-modal/continue-or-reset-modal.component';
import { ThemeService } from '../../shared/service/theme.service';
import { DeleteExerciseModalComponent } from './components/delete-exercise-modal/delete-exercise-modal.component';
import { ExercisePickerModalComponent } from '../+plan/components/exercise-picker-modal/exercise-picker-modal.component';
import { WorkoutExercise } from '../../shared/interfaces/workoutexercise';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { LastCompletedLogModalComponent } from '../../shared/components/last-completed-log-modal/last-completed-log-modal.component';
import { GymService } from '../../shared/service/gym.service';
import { GymSelectionModalComponent } from '../../shared/components/gym-selection-modal/gym-selection-modal.component';

@Component({
  selector: 'app-logpage',
  standalone: true,
  imports: [
    DragDropModule,
    CommonModule,
    ReactiveFormsModule,
    BackToMenuComponent,
    FormsModule,
    ConfirmationModalComponent,
    ContinueOrResetModalComponent,
    DeleteExerciseModalComponent,
    ExercisePickerModalComponent,
    TranslateModule,
    LastCompletedLogModalComponent,
    GymSelectionModalComponent,
  ],
  templateUrl: './logpage.component.html',
  styleUrl: './logpage.component.css',
})
export class LogpageComponent implements OnInit, OnDestroy {
  @Input() planId: number | null = null;

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

  lastCompletedLog: WorkoutLog | null = null;
  isLastLogModalOpen: boolean = false;

  editingLog: WorkoutLog | null = null;
  isNotesModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  isExercisePickerModalOpen = false;

  gyms: any[] = [];
  gymId: number | null = null;

  isGymSelectionModalOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private planService: PlanService,
    private workoutLogService: WorkoutLogService,
    private workoutDataService: WorkoutDataService,
    private userService: UserService,
    private toastService: ToastService,
    private router: Router,
    private themeService: ThemeService,
    private gymService: GymService
  ) {
    this.themeService.initializeThemeUserFromLocalStorage();
  }

  ngOnInit() {
    const planId = localStorage.getItem('activePlanId');
    if (planId) {
      this.planId = parseInt(planId, 10);
    } else {
      console.error('Plan ID is missing in localStorage');
    }

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

  handleGymSelection(gymId: number): void {
    this.gymId = gymId;
    this.isGymSelectionModalOpen = false;

    this.workoutLogService
      .getWorkoutLogByUserIdAndIsEditing(this.userId, this.workoutId, true)
      .subscribe({
        next: (editingLog) => {
          if (editingLog && editingLog.gymId == this.gymId) {
            this.askUserToContinueOrReset(editingLog);
          } else {
            this.loadLastCompletedWorkoutLog();
          }
        },
        error: (err) => {
          this.loadLastCompletedWorkoutLog();
        },
      });
  }

  cancelGymSelection(): void {
    this.isGymSelectionModalOpen = false;
  }

  openGymSelectionModal(): void {
    this.isGymSelectionModalOpen = true;
  }

  loadGyms(): void {
    if (!this.userId) return;
    this.gymService.getUserGyms(this.userId).subscribe((gyms) => {
      this.gyms = gyms;
      if (this.gyms.length > 0) {
        this.openGymSelectionModal();
      } else {
        this.initializeWorkoutLog();
      }
    });
  }

  ngOnDestroy() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
  }

  toggleExercisePickerModal(isOpen: boolean): void {
    this.isExercisePickerModalOpen = isOpen;
  }
  toggleNotesModal(): void {
    this.isNotesModalOpen = !this.isNotesModalOpen;
  }
  getCurrentExercises(): WorkoutExercise[] {
    return this.exercises.controls.map((exerciseControl) => ({
      id: exerciseControl.get('id')?.value || 0,
      exerciseId: exerciseControl.get('exerciseId')?.value,
      workoutId: this.workoutId,
      exerciseName: exerciseControl.get('name')?.value,
      sets: exerciseControl.get('sets')?.value || [],
      exerciseOrder: this.exercises.controls.indexOf(exerciseControl) + 1,
    }));
  }

  addExerciseToLog(workoutExercise: WorkoutExercise): void {
    const exercisesArray = this.workoutLogForm.get('exercises') as FormArray;

    const newExerciseGroup = this.fb.group({
      id: [null],
      exerciseId: [workoutExercise.exerciseId],
      workoutLogId: [this.workoutLogId],
      name: [workoutExercise.exerciseName],
      notes: [''],
      open: [false],
      sets: this.fb.array([this.createSet()]),
      exerciseOrder: [exercisesArray.length + 1],
    });

    exercisesArray.push(newExerciseGroup);

    const newExercisePayload = {
      workoutLogId: this.workoutLogId,
      exerciseId: workoutExercise.exerciseId,
      exerciseName: workoutExercise.exerciseName,
      notes: '',
      sets: [
        {
          set: 1,
          reps: 0,
          weight: 0,
        },
      ],
      exerciseOrder: exercisesArray.length,
    };

    this.workoutLogService.addWorkoutLogExercise(newExercisePayload).subscribe({
      next: (createdExercise) => {
        newExerciseGroup.patchValue({ id: createdExercise.id });
      },
      error: (error) => {
        console.error('Failed to create exercise:', error);
        this.toastService.showToast(
          TOAST_MSGS.failedtocreateexercise,
          'danger'
        );
        exercisesArray.removeAt(exercisesArray.length - 1);
      },
    });
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

      this.gymService.getUserGyms(this.userId).subscribe({
        next: (gyms) => {
          this.gyms = gyms;

          if (this.gyms.length > 0) {
            this.openGymSelectionModal();
          } else {
            this.loadLastCompletedWorkoutLog();
          }
        },
        error: (err) => {
          this.loadLastCompletedWorkoutLog();
        },
      });
    } else {
      this.router.navigate([LOCATIONS.plans]);
    }
  }

  proceedWithWorkoutLogCreation() {
    this.workoutLogService
      .getWorkoutLogByUserIdAndIsEditing(this.userId, this.workoutId, true)
      .subscribe({
        next: (editingLog) => {
          if (editingLog) {
            this.askUserToContinueOrReset(editingLog);
          } else {
            this.workoutLogService
              .getLastCompletedWorkoutLog(
                this.userId,
                this.workoutId,
                this.gymId
              )
              .subscribe({
                next: (lastCompletedLog) => {
                  if (lastCompletedLog) {
                    this.lastCompletedLog = lastCompletedLog;
                    this.isLastLogModalOpen = true;
                  } else {
                    this.createAndLoadWorkoutLog();
                  }
                },
                error: (err) => {
                  console.error('Error fetching last completed log:', err);
                  this.createAndLoadWorkoutLog();
                },
              });
          }
        },
        error: (err) => {
          if (err.status === 204) {
            this.workoutLogService
              .getLastCompletedWorkoutLog(
                this.userId,
                this.workoutId,
                this.gymId
              )
              .subscribe({
                next: (lastCompletedLog) => {
                  if (lastCompletedLog) {
                    this.lastCompletedLog = lastCompletedLog;
                    this.isLastLogModalOpen = true;
                  } else {
                    this.createAndLoadWorkoutLog();
                  }
                },
                error: (err) => {
                  console.error('Error fetching last completed log:', err);
                  this.createAndLoadWorkoutLog();
                },
              });
          } else {
            console.error('Unexpected error:', err);
            this.toastService.showToast(
              'An unexpected error occurred while fetching the workout log.',
              'danger'
            );
          }
        },
      });
  }

  compareWithLastCompleted(
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight'
  ): string {
    if (!this.lastCompletedLog || !this.lastCompletedLog.exercises) {
      return '';
    }

    const currentExercise = this.exercises.at(exerciseIndex);
    if (!currentExercise) return '';

    const currentSet = this.getSets(currentExercise).at(setIndex);
    if (!currentSet) return '';

    const currentValue = currentSet.get(field)?.value;

    const mergedExercises = this.groupAndMergeSets(
      this.lastCompletedLog.exercises
    );

    const lastExercise = mergedExercises.find(
      (ex) => ex.exerciseId === currentExercise.get('exerciseId')?.value
    );

    if (!lastExercise) {
      return '';
    }

    const lastSet = lastExercise.sets.find((s) => s.set === setIndex + 1);
    if (!lastSet) {
      return '';
    }

    const lastValue = lastSet[field];

    if (currentValue > lastValue) {
      return 'higher';
    } else if (currentValue < lastValue) {
      return 'lower';
    } else {
      return 'same';
    }
  }

  groupAndMergeSets(exercises: WorkoutLogExercise[]): WorkoutLogExercise[] {
    const grouped: { [key: number]: WorkoutLogExercise } = {};

    exercises.forEach((exercise) => {
      if (!grouped[exercise.exerciseId]) {
        grouped[exercise.exerciseId] = {
          ...exercise,
          sets: [...exercise.sets],
        };
      } else {
        grouped[exercise.exerciseId].sets.push(...exercise.sets);
      }
    });

    Object.values(grouped).forEach((exercise) => {
      exercise.sets.sort((a, b) => a.set - b.set);
    });

    return Object.values(grouped);
  }

  loadLastCompletedWorkoutLog() {

    this.workoutLogService
      .getLastCompletedWorkoutLog(this.userId, this.workoutId, this.gymId !== null ? this.gymId : 0)
      .subscribe({
        next: (lastCompletedLog) => {
          if (lastCompletedLog && lastCompletedLog.exercises.length > 0) {
            this.lastCompletedLog = lastCompletedLog;
            this.isLastLogModalOpen = true;
          } else {
            this.proceedWithWorkoutLogCreation();
          }
        },
        error: (err) => {
          console.error('Error fetching last completed log:', err);
          this.proceedWithWorkoutLogCreation();
        },
      });
  }

  handleLastLogUse() {
    if (this.lastCompletedLog) {
      this.populateFormWithSavedData(this.lastCompletedLog);

      setTimeout(() => {
        this.createWorkoutLog();
        this.isLastLogModalOpen = false;
      }, 50);
    }
  }

  handleLastLogCreateNew() {
    this.createAndLoadWorkoutLog();
    this.isLastLogModalOpen = false;
    this.lastCompletedLog = null;
  }

  handleLastLogCancel() {
    this.isLastLogModalOpen = false;
    this.lastCompletedLog = null;
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
    this.editingLog = null;
  }
  trackFormChanges() {
    if (!this.workoutLogId) {
      return;
    }

    let updateTimeout: any;

    this.formChangesSubscription = this.workoutLogForm.valueChanges.subscribe(
      () => {
        if (this.workoutLogId && this.firstChangeMade) {
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
              notes: [exercise.notes || null],
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
      const groupedExercises = this.groupExercisesById(
        savedWorkoutLog.exercises
      );

      groupedExercises
        .sort((a, b) => (a.exerciseOrder || 0) - (b.exerciseOrder || 0))
        .forEach((exercise, index) => {
          const formGroup = this.fb.group({
            id: [exercise.id],
            exerciseId: [exercise.exerciseId],
            workoutLogId: [exercise.workoutLogId],
            name: [exercise.exerciseName],
            notes: [exercise.notes],
            open: [false],
            exerciseOrder: [exercise.exerciseOrder || index + 1],
            sets: this.fb.array(
              exercise.sets
                .sort((a, b) => a.set - b.set)
                .map((set) => this.createSetWithValues(set))
            ),
          });

          exercisesArray.push(formGroup);
        });

      setTimeout(() => {
        this.workoutLogForm.updateValueAndValidity();
      }, 100);
    }
  }

  groupExercisesById(exercises: WorkoutLogExercise[]): WorkoutLogExercise[] {
    const grouped: { [key: number]: WorkoutLogExercise } = {};

    exercises.forEach((exercise) => {
      if (!grouped[exercise.exerciseId]) {
        grouped[exercise.exerciseId] = {
          ...exercise,
          sets: [...exercise.sets],
        };
      } else {
        grouped[exercise.exerciseId].sets.push(...exercise.sets);
      }
    });

    return Object.values(grouped);
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
      defaultReps: [set.reps],
      defaultWeight: [set.weight],
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
    if (!this.isLastSetValid(exerciseIndex)) {
      this.toastService.showToast(TOAST_MSGS.pleasefillallfields, 'danger');
      return;
    }

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
      gymId: this.gymId,
      date: new Date().toISOString(),
      exercises: this.exercises.controls.map((exerciseControl, index) => ({
        exerciseId: exerciseControl.get('exerciseId')?.value,
        exerciseOrder: index + 1,
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

    this.workoutLogService.createWorkoutLog(initialWorkoutLog).subscribe({
      next: (response) => {
        this.workoutLogId = response.id;
        this.loadSavedWorkoutLog();
        this.firstChangeMade = true;
        this.trackFormChanges();
      },
      error: (error) => {
        this.toastService.showToast(TOAST_MSGS.errorcreatingworkout, 'danger');
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
        sets: this.getSets(exerciseControl)
          .controls.map((setControl, setIndex) => ({
            set: setIndex + 1,
            reps: setControl.get('reps')?.value,
            weight: setControl.get('weight')?.value,
          }))
          .sort((a, b) => a.set - b.set),
        exerciseOrder: index + 1,
      })),
      editing: true,
    };

    this.workoutLogService
      .updateWorkoutLog(this.workoutLogId, updatedWorkoutLog)
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error('Error updating workout log', error);
          this.toastService.showToast(
            TOAST_MSGS.errorcreatingworkout,
            'danger'
          );
        },
      });
  }

  submitWorkoutLog() {
    if (this.formChangesSubscription) {
      this.formChangesSubscription.unsubscribe();
    }
    setTimeout(() => {
      if (this.workoutLogForm.valid) {
        const exercisesArray = this.exercises.controls.map(
          (exerciseControl, index) => ({
            id: exerciseControl.get('id')?.value,
            exerciseId: exerciseControl.get('exerciseId')?.value,
            workoutLogId: this.workoutLogId,
            exerciseOrder: index + 1,
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
          editing: false,
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
                TOAST_MSGS.errorcreatingworkout,
                'danger'
              );
            },
          });
      } else {
        this.toastService.showToast(TOAST_MSGS.fillallfields, 'danger');
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

  deleteSet(exerciseIndex: number, setIndex: number) {
    const exerciseControl = this.exercises.at(exerciseIndex);
    const sets = this.getSets(exerciseControl);

    if (sets.length === 1) {
      this.toastService.showToast(TOAST_MSGS.cantdeleteallsets, 'danger');
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
              TOAST_MSGS.errorcreatingworkout,
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
    return (
      this.exercises.controls.some(
        (exercise) => this.getSets(exercise).length > 0
      ) && this.areAllSetsValid()
    );
  }

  areAllSetsValid(): boolean {
    return this.exercises.controls.every((exercise) =>
      this.getSets(exercise).controls.every((set) => {
        const reps = set.get('reps')?.value;
        const weight = set.get('weight')?.value;
        return (
          reps !== null &&
          reps !== undefined &&
          reps > 0 &&
          weight !== null &&
          weight !== undefined &&
          weight >= 0
        );
      })
    );
  }

  handleSubmitClick(): void {
    if (!this.workoutLogForm.valid || !this.hasSets()) {
      let errorMessage = '';

      if (!this.workoutLogForm.valid) {
        errorMessage += '\n Ensure all required fields are filled correctly.';
      }

      if (!this.hasSets()) {
        errorMessage += '\n Add at least one valid set to each exercise.';
      }

      this.toastService.showToast(errorMessage, 'danger');
    } else {
      this.submitWorkoutLog();
    }
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
                TOAST_MSGS.notessavedsuccessfully,
                'success'
              );
            },
            error: (error) => {
              this.toastService.showToast(
                TOAST_MSGS.errorcreatingworkout,
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
  deleteWorkoutLogExercise(index: number): void {
    const exerciseControl = this.exercises.at(index);
    this.selectedExercise = exerciseControl.get('name')?.value || 'Unknown';
    this.selectedExerciseIndex = index;

    this.isDeleteModalOpen = true;
  }

  handleConfirmDelete(): void {
    if (this.selectedExerciseIndex !== null) {
      const exerciseControl = this.exercises.at(this.selectedExerciseIndex);
      const exerciseId = exerciseControl.get('exerciseId')?.value;
      const workoutLogId = this.workoutLogId;

      if (exerciseId && workoutLogId) {
        this.workoutLogService
          .deleteWorkoutLogExercise(workoutLogId, exerciseId)
          .subscribe({
            next: () => {
              this.loadSavedWorkoutLog();
              this.toastService.showToast(
                'Exercise and all sets deleted successfully',
                'success'
              );
              this.isDeleteModalOpen = false;
              this.selectedExerciseIndex = null;
            },
            error: (error) => {
              this.toastService.showToast(
                'Failed to delete the exercise',
                'danger'
              );
              console.error('Error deleting exercise:', error);
            },
          });
      } else {
        console.error('Missing workoutLogId or exerciseId');
        this.toastService.showToast(
          'Invalid operation. Unable to delete exercise.',
          'danger'
        );
      }
    }
  }

  handleCancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.selectedExerciseIndex = null;
  }

  clearDefaultValue(
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

  resetToZero(
    exerciseIndex: number,
    setIndex: number,
    field: 'reps' | 'weight'
  ) {
    const exercise = this.exercises.at(exerciseIndex);
    const set = this.getSets(exercise).at(setIndex);

    if (set.get(field)?.value === '' || set.get(field)?.value === null) {
      set.get(field)?.setValue(0);
    }
  }
  dropExercise(event: CdkDragDrop<FormGroup[]>): void {
    const exercises = this.exercises.controls;

    moveItemInArray(exercises, event.previousIndex, event.currentIndex);

    exercises.forEach((exercise, index) => {
      exercise.patchValue({ exerciseOrder: index + 1 });
    });

    const reorderedExercises = exercises
      .map((exercise) => ({
        id: exercise.get('id')?.value,
        exerciseOrder: exercise.get('exerciseOrder')?.value,
      }))
      .filter((exercise) => exercise.id !== null);

    this.workoutLogService
      .updateWorkoutExerciseOrder(this.workoutLogId, reorderedExercises)
      .subscribe({
        next: () => {
          this.toastService.showToast(TOAST_MSGS.reorderingsaved, 'success');
        },
        error: (err) => {
          console.error('Failed to save reordering:', err);
          this.toastService.showToast(
            TOAST_MSGS.failedtosavereordering,
            'danger'
          );
        },
      });
  }
}
