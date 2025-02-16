import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-gym-selection-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './gym-selection-modal.component.html',
  styleUrls: ['./gym-selection-modal.component.css'],
})
export class GymSelectionModalComponent {
  @Input() gyms: any[] = [];
  @Input() selectedGymId: number | null = null;
  @Input() selectedGymName: string = '';
  @Output() onSelectGym = new EventEmitter<number>();
  @Output() onCancel = new EventEmitter<void>();


  confirmSelection() {
    if (this.selectedGymId !== null) {
      this.onSelectGym.emit(this.selectedGymId);
    }
  }

  cancel() {
    this.onCancel.emit();
  }
  getSelectedGymName(): string {
    return this.selectedGymName || '';
  }
}
