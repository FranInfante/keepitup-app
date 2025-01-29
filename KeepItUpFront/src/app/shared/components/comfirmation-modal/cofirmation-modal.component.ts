import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent {
  @Output() onCancel = new EventEmitter<void>();
  @Output() onDiscard = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<void>();

  cancel() {
    this.onCancel.emit();
  }

  discard() {
    this.onDiscard.emit();
  }

  save() {
    this.onSave.emit();
  }
}
