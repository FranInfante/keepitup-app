import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-exercise-modal',
  standalone: true,
  templateUrl: './delete-exercise-modal.component.html',
  styleUrls: ['./delete-exercise-modal.component.css'],
})
export class DeleteExerciseModalComponent {
  @Input() exerciseName!: string;
  @Output() confirmDelete = new EventEmitter<void>();
  @Output() cancelDelete = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmDelete.emit();
  }

  onCancel(): void {
    this.cancelDelete.emit();
  }
}
