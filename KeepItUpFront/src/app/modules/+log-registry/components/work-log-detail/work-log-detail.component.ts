import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-work-log-detail',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './work-log-detail.component.html',
  styleUrl: './work-log-detail.component.css'
})
export class WorkoutLogDetailModalComponent {
  @Input() workoutLog: any;
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  isNotesModalOpen: boolean = false;
  selectedExerciseNotes: string | null = null;

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
}
