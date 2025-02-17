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
  imports: [CommonModule, TranslateModule, GymSelectionModalComponent],
  templateUrl: './work-log-detail.component.html',
  styleUrl: './work-log-detail.component.css'
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
  selectedGymName: string = '';  

  isExpanded: boolean = false; 

  constructor(
    private workoutLogService: WorkoutLogService,
    private gymService: GymService,
    private translate: TranslateService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workoutLog'] && this.workoutLog) {

      this.selectedGymId = this.workoutLog.gymId || null;

      this.loadGyms();
    }
  }

  loadGyms() {
    if (!this.workoutLog || !this.workoutLog.userId) {
      console.warn('⚠️ No workoutLog or userId available.');
      return;
    }

    this.gymService.getUserGyms(this.workoutLog.userId).subscribe({
      next: (gyms) => {
        this.gyms = gyms;

        this.setSelectedGymName();
      },
      error: (err) => {
        console.error('❌ Failed to load gyms', err);
      },
    });
  }

  setSelectedGymName() {

    const foundGym = this.gyms.find((g) => g.id === this.selectedGymId);
    if (foundGym) {
      this.selectedGymName = foundGym.name;
    } else {
      this.selectedGymName = this.translate.instant('WORKOUT_LOG_DETAILS.NO_GYM');
    }
  }

  openGymSelectionModal() {
    this.isGymSelectionModalOpen = true;
  }

  handleGymSelection(gymId: number) {
    this.selectedGymId = gymId;
    this.isGymSelectionModalOpen = false;
      
    this.workoutLogService.updateGymId(this.workoutLog.id, gymId).subscribe({
      next: () => {  
        this.workoutLog.gymId = gymId;
  
        this.gymService.getUserGyms(this.workoutLog.userId).subscribe({
          next: (gyms) => {
            this.gyms = gyms;
  
            const foundGym = this.gyms.find((g) => g.id == this.selectedGymId);
            if (foundGym) {
              this.selectedGymName = foundGym.name;
            } else {
              this.selectedGymName = this.translate.instant('WORKOUT_LOG_DETAILS.NO_GYM');
            }
          },
          error: (err) => {
            console.error('❌ Failed to reload gyms', err);
          },
        });
      },
      error: (err) => {
        console.error('❌ Failed to update gym', err);
      },
    });
  }
  
  
  

  getSelectedGymName(): string {
    return this.selectedGymName || this.translate.instant('WORKOUT_LOG_DETAILS.NO_GYM');
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

  toggleExpanded()
  {
    this.isExpanded =!this.isExpanded;
  }
}
