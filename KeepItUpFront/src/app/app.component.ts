import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbdToastInline } from './shared/components/toast/toast.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { LoadingService } from './shared/service/loading.service';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet, NgbdToastInline, LoadingSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent {
  title = 'KeepItUp!';
  isLoading$;

  constructor(private loadingService: LoadingService, private translate: TranslateService) {

    this.translate.setDefaultLang('en');

    this.isLoading$ = this.loadingService.isLoading$;

    
  }
}
