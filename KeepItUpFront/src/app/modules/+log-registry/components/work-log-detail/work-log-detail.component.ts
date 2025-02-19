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
import { GymSelectionModalComponent } from '../../../../shared/components/gym-selection-modal/gym-selection-modal.component';
import { animate, state, style, transition, trigger } from '@angular/animations'


@Component({
  selector: 'app-work-log-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule, GymSelectionModalComponent],
  templateUrl: './work-log-detail.component.html',
  styleUrl: './work-log-detail.component.css',
  animations: [
    trigger('slideDown', [
      state('closed', style({ height: '0px', opacity: 0})),
      state('open', style({ height: '*', opacity: 1, marginBottom: '1rem' })),
      transition('closed => open', animate('300ms ease-in-out')),
      transition('open => closed', animate('300ms ease-in-out')),
    ]),
  ],
})
export class WorkoutLogDetailModalComponent {
  @Input() workoutLog: any;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() gymUpdated = new EventEmitter<{ workoutLogId: number; gymId: number }>(); // Emit gym updates

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
            this.selectedGymName = foundGym ? foundGym.name : this.translate.instant('WORKOUT_LOG_DETAILS.NO_GYM');
  
            this.gymUpdated.emit({ workoutLogId: this.workoutLog.id, gymId });
          }
        });
      }
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
    this.isExpanded = false;
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
