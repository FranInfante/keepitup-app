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
  @Output() onSelectGym = new EventEmitter<number>();
  @Output() onCancel = new EventEmitter<void>();

  selectedGymId: number | null = null;

  confirmSelection() {
    if (this.selectedGymId !== null) {
      this.onSelectGym.emit(this.selectedGymId);
    }
  }

  cancel() {
    this.onCancel.emit();
  }
}
