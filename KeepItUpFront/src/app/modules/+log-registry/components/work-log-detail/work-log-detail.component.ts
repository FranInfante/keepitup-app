import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { WorkoutLogService } from '../../../../shared/service/workoutlog.service';
import { GymService } from '../../../../shared/service/gym.service';
import { FormsModule } from '@angular/forms';
import { GymSelectionModalComponent } from '../../../../shared/components/gym-selection-modal/gym-selection-modal.component';

@Component({
  selector: 'app-work-log-detail',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    GymSelectionModalComponent,
  ],
  templateUrl: './work-log-detail.component.html',
  styleUrl: './work-log-detail.component.css',
})
export class WorkoutLogDetailModalComponent {
  @Input() workoutLog: any;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  isNotesModalOpen: boolean = false;
  selectedExerciseNotes: string | null = null;
  gyms: any[] = [];
  selectedGymId: number | null = null;
  isGymSelectionModalOpen: boolean = false;

  constructor(
    private workoutLogService: WorkoutLogService,
    private gymService: GymService,
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workoutLog'] && this.workoutLog) {
      this.loadGyms();
      this.selectedGymId = this.workoutLog.gymId || null; // Initialize gym selection
    }
  }

  loadGyms() {
    if (!this.workoutLog || !this.workoutLog.userId) return;

    this.gymService.getUserGyms(this.workoutLog.userId).subscribe({
      next: (gyms) => {
        this.gyms = gyms;
      },
      error: (err) => {
        console.error('Failed to load gyms', err);
      },
    });
  }

  openGymSelectionModal() {
    this.isGymSelectionModalOpen = true;
  }

  handleGymSelection(gymId: number) {
    this.selectedGymId = gymId;
    this.isGymSelectionModalOpen = false;
  
    this.workoutLogService.updateGymId(this.workoutLog.id, gymId).subscribe({
      next: () => {
        console.log('Gym updated successfully');
      },
      error: (err) => {
        console.error('Failed to update gym', err);
      },
    });
  }
  

  cancelGymSelection() {
    this.isGymSelectionModalOpen = false;
  }

  onClose() {
    this.closeModal.emit();
  }
  onBackdropClick(event: MouseEvent) {
    this.onClose();
  }
  toggleNotesModal(notes?: string | null): void {
    if (notes !== undefined) {
      this.selectedExerciseNotes = notes;
    }
    this.isNotesModalOpen = !this.isNotesModalOpen;
  }

  getSelectedGymName(): string {
    if (!this.gyms || this.gyms.length === 0) {
      return this.translate.instant('WORKOUT_LOG_DETAILS.NO_GYM');
    }
    const gym = this.gyms.find((g) => g.id === this.selectedGymId);
    return gym
      ? gym.name
      : this.translate.instant('WORKOUT_LOG_DETAILS.NO_GYM');
  }
}
