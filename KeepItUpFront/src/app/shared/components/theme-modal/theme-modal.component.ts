import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../service/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-theme-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './theme-modal.component.html',
  styleUrl: './theme-modal.component.css'
})
export class ThemeModalComponent {
  currentTheme: string = 'dark';

  @Output() closeModal = new EventEmitter<void>();

  constructor(private themeService: ThemeService) {}

  switchTheme(theme: string) {
    this.themeService.updateUserTheme(theme); 
    this.currentTheme = theme;
    this.closeModal.emit();
  }
}
