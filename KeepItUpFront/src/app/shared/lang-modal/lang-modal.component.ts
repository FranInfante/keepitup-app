import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ASSET_URLS } from '../constants';

@Component({
  selector: 'app-lang-modal',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './lang-modal.component.html',
  styleUrl: './lang-modal.component.css',
})
export class LanguageSwitcherComponent {
  @Output() closeModal = new EventEmitter<void>();

  spain: string = ASSET_URLS.spain;
  english: string = ASSET_URLS.english;

  constructor(private translate: TranslateService) {}

  switchLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
    this.closeModal.emit();
  }
}
