import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-last-completed-log-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './last-completed-log-modal.component.html',
  styleUrls: ['./last-completed-log-modal.component.css'],
})
export class LastCompletedLogModalComponent {
  @Output() onUseLast = new EventEmitter<void>();
  @Output() onCreateNew = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  useLast() {
    this.onUseLast.emit();
  }

  createNew() {
    this.onCreateNew.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
}
