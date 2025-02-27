import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-continue-or-reset-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './continue-or-reset-modal.component.html',
  styleUrl: './continue-or-reset-modal.component.css',
})
export class ContinueOrResetModalComponent {
  @Output() onContinue = new EventEmitter<void>();
  @Output() onReset = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
  continue() {
    this.onContinue.emit();
  }

  reset() {
    this.onReset.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
