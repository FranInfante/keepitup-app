import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-plan-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './delete-plan-modal.component.html',
  styleUrl: './delete-plan-modal.component.css'
})
export class DeletePlanModalComponent {
  @Input() planName!: string;
  @Output() planDeleted = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  confirmDelete(): void {
    this.planDeleted.emit();
    this.closeModal.emit();
  }

  cancelDelete(): void {
    this.closeModal.emit();
  }
}
